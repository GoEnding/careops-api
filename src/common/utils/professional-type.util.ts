import { ProfessionalType } from '../enums/professional-type.enum';

export function isMohwLicensedType(type: ProfessionalType): boolean {
  const licensedTypes: ProfessionalType[] = [
    ProfessionalType.DOCTOR,
    ProfessionalType.DENTIST,
    ProfessionalType.ORIENTAL_DOCTOR,
    ProfessionalType.NURSE,
    ProfessionalType.PHYSICAL_THERAPIST,
    ProfessionalType.OCCUPATIONAL_THERAPIST,
    ProfessionalType.CLINICAL_PATHOLOGIST,
    ProfessionalType.RADIOLOGIC_TECHNOLOGIST,
    ProfessionalType.PHARMACIST,
    ProfessionalType.OPTICIAN,
    ProfessionalType.DENTAL_HYGIENIST,
    ProfessionalType.DENTAL_TECHNICIAN,
    ProfessionalType.MEDICAL_RECORD_ADMINISTRATOR,
    ProfessionalType.HYGIENIST,
    ProfessionalType.NUTRITIONIST,
    ProfessionalType.EMT,
    ProfessionalType.MIDWIFE,
    ProfessionalType.NURSE_ASSISTANT,
    ProfessionalType.ASSISTIVE_DEVICE_TECHNICIAN,
    ProfessionalType.SPEECH_LANGUAGE_PATHOLOGIST,
  ];

  return licensedTypes.includes(type);
}