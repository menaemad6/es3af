export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  field: string;
  year_of_study: string;
  gender: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserProfileData {
  user_id: string;
  first_name: string;
  field: string;
  year_of_study: string;
  gender: string;
}

export interface UpdateUserProfileData {
  first_name?: string;
  field?: string;
  year_of_study?: string;
  gender?: string;
}

export const FIELD_OPTIONS = [
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Dentistry",
  "Physiotherapy",
  "Medical Laboratory Sciences",
  "Radiology",
  "Public Health",
  "Biomedical Sciences",
  "Other",
] as const;

export const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year", 
  "3rd Year",
  "4th Year",
  "5th Year",
  "6th Year",
  "Graduate Student",
  "Resident",
  "Fellow",
  "Practicing Professional",
] as const;

export const GENDER_OPTIONS = [
  "Male", 
  "Female", 
  // "Other", 
  // "Prefer not to say"
] as const;

export type FieldType = typeof FIELD_OPTIONS[number];
export type YearType = typeof YEAR_OPTIONS[number];
export type GenderType = typeof GENDER_OPTIONS[number]; 