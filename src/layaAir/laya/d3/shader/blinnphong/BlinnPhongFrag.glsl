#if !defined(BlinnPhongFrag_lib)
    #define BlinnPhongFrag_lib

    #include "BlinnPhongLighting.glsl";

    #include "BlinnPhongCommon.glsl";

void getPixelParams(inout PixelParams params)
{
    params.positionWS = v_PositionWS;
    params.normalWS = normalize(v_NormalWS);

    #ifdef UV
    params.uv0 = v_Texcoord0;
    #endif // UV

    #ifdef UV1
	#ifdef LIGHTMAP
    params.uv1 = v_Texcoord1;
	#endif // LIGHTMAP
    #endif // UV1

    #ifdef COLOR
    params.vertexColor = v_VertexColor;
    #endif // COLOR

    params.viewDir = normalize(u_CameraPos - params.positionWS);

    #ifdef TANGENT
	#ifdef NEEDTBN
    params.tangentWS = normalize(v_TangentWS);
    params.biNormalWS = normalize(v_BiNormalWS);
    mat3 TBN = mat3(params.tangentWS, params.biNormalWS, params.normalWS);

	    #ifdef NORMALMAP
    vec3 normalSampler = texture2D(u_NormalTexture, params.uv0).rgb;
    normalSampler = normalize(normalSampler * 2.0 - 1.0);
    normalSampler.y *= -1.0;
    params.normalWS = normalize(TBN * normalSampler);
	    #endif // NORMALMAP

	#endif // NEEDTBN
    #endif TANGENT
}

void getPixelInfo(inout PixelInfo info, const in PixelParams pixel)
{
    info.positionWS = pixel.positionWS;
    info.normalWS = pixel.normalWS;
    info.viewDir = pixel.viewDir;

    #ifdef LIGHTMAP
	#ifdef UV1
    info.lightmapUV = pixel.uv1;
	#endif // UV1
    #endif // LIGHTMAP
}

vec3 BlinnPhongLighting(const in Surface surface, const in PixelParams pixel)
{
    vec3 positionWS = pixel.positionWS;
    vec3 v = pixel.viewDir;
    vec3 normalWS = pixel.normalWS;

    PixelInfo info;
    getPixelInfo(info, pixel);

    vec3 lightColor = vec3(0.0, 0.0, 0.0);

    #ifdef DIRECTIONLIGHT
    for (int i = 0; i < CalculateLightCount; i++)
	{
	    if (i >= DirectionCount)
		break;
	    DirectionLight directionLight = getDirectionLight(i, positionWS);
	    if (directionLight.lightMode == LightMode_Mix)
		{
		    continue;
		}
	    Light light = getLight(directionLight);
	    lightColor += BlinnPhongLighting(surface, light, info) * light.attenuation;
	}
    #endif // DIRECTIONLIGHT

    #if defined(POINTLIGHT) || defined(SPOTLIGHT)
    ivec4 clusterInfo = getClusterInfo(u_View, u_Viewport, positionWS, gl_FragCoord, u_ProjectionParams);
    #endif // POINTLIGHT || SPOTLIGHT

    #ifdef POINTLIGHT
    for (int i = 0; i < CalculateLightCount; i++)
	{
	    if (i >= clusterInfo.x)
		break;
	    PointLight pointLight = getPointLight(i, clusterInfo, positionWS);
	    if (pointLight.lightMode == LightMode_Mix)
		{
		    continue;
		}
	    Light light = getLight(pointLight, normalWS, positionWS);
	    lightColor += BlinnPhongLighting(surface, light, info) * light.attenuation;
	}
    #endif // POINTLIGHT

    #ifdef SPOTLIGHT
    for (int i = 0; i < CalculateLightCount; i++)
	{
	    if (i >= clusterInfo.y)
		break;
	    SpotLight spotLight = getSpotLight(i, clusterInfo, positionWS);
	    if (spotLight.lightMode == LightMode_Mix)
		{
		    continue;
		}
	    Light light = getLight(spotLight, normalWS, positionWS);
	    lightColor += BlinnPhongLighting(surface, light, info) * light.attenuation;
	}
    #endif // SPOTLIGHT

    vec3 giColor = BlinnPhongGI(surface, info);

    return lightColor + giColor;
}

#endif // BlinnPhongFrag_lib