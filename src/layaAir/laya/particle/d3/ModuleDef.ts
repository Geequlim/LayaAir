import { ClassUtils } from "../../utils/ClassUtils";
import { Burst } from "./module/Burst";
import { ColorOverLifetime } from "./module/ColorOverLifetime";
import { Emission } from "./module/Emission";
import { FrameOverTime } from "./module/FrameOverTime";
import { GradientAngularVelocity } from "./module/GradientAngularVelocity";
import { GradientColor } from "./module/GradientColor";
import { GradientDataInt } from "./module/GradientDataInt";
import { GradientDataNumber } from "./module/GradientDataNumber";
import { GradientSize } from "./module/GradientSize";
import { GradientVelocity } from "./module/GradientVelocity";
import { RotationOverLifetime } from "./module/RotationOverLifetime";
import { BaseShape } from "./module/shape/BaseShape";
import { BoxShape } from "./module/shape/BoxShape";
import { CircleShape } from "./module/shape/CircleShape";
import { ConeShape } from "./module/shape/ConeShape";
import { HemisphereShape } from "./module/shape/HemisphereShape";
import { SphereShape } from "./module/shape/SphereShape";
import { SizeOverLifetime } from "./module/SizeOverLifetime";
import { StartFrame } from "./module/StartFrame";
import { TextureSheetAnimation } from "./module/TextureSheetAnimation";
import { VelocityOverLifetime } from "./module/VelocityOverLifetime";
import { ShuriKenParticle3D } from "./ShuriKenParticle3D";
import { ShurikenParticleMaterial } from "./ShurikenParticleMaterial";
import { ShurikenParticleRenderer } from "./ShurikenParticleRenderer";
import { ShurikenParticleSystem } from "./ShurikenParticleSystem";
let c = ClassUtils.regClass;
c("ShurikenParticleMaterial", ShurikenParticleMaterial);
c("ShuriKenParticle3D", ShuriKenParticle3D);
c("ShurikenParticleRenderer", ShurikenParticleRenderer);
c("ShurikenParticleSystem", ShurikenParticleSystem);
c("Burst", Burst);
c("Emission", Emission);
c("BaseShape", BaseShape);
c("BoxShape", BoxShape);
c("CircleShape", CircleShape);
c("ConeShape", ConeShape);
c("HemisphereShape", HemisphereShape);
c("SphereShape", SphereShape);
c("FrameOverTime", FrameOverTime);
c("GradientAngularVelocity", GradientAngularVelocity);
c("GradientColor", GradientColor);
c("GradientDataInt", GradientDataInt);
c("GradientDataNumber", GradientDataNumber);
c("GradientSize", GradientSize);
c("GradientVelocity", GradientVelocity);
c("StartFrame", StartFrame);
c("TextureSheetAnimation", TextureSheetAnimation);
c("ColorOverLifetime", ColorOverLifetime);
c("RotationOverLifetime", RotationOverLifetime);
c("SizeOverLifetime", SizeOverLifetime);
c("VelocityOverLifetime", VelocityOverLifetime);