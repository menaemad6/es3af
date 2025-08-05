# Database Setup for User Profiles

This document explains how to set up the user profiles functionality in your Supabase database.

## Prerequisites

- Supabase project set up
- Access to Supabase dashboard

## Setup Steps

### 1. Create the user_profiles table

Run the SQL script in `supabase_migrations/user_profiles_table.sql` in your Supabase SQL editor.

This will create:
- A `user_profiles` table with the following columns:
  - `id` (UUID, Primary Key)
  - `user_id` (TEXT, Unique, references Clerk user ID)
  - `first_name` (TEXT, required)
  - `field` (TEXT, required)
  - `year_of_study` (TEXT, required)
  - `gender` (TEXT, required)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

### 2. Row Level Security (RLS)

The table is configured with RLS policies that allow all operations since this application uses Clerk for authentication instead of Supabase Auth. The security is handled at the application level by ensuring users can only access their own data through the user_id field.

### 3. Automatic Timestamps

The table includes:
- Automatic `created_at` timestamp on insert
- Automatic `updated_at` timestamp on update

## Table Structure

```sql
user_profiles
├── id (UUID, Primary Key)
├── user_id (TEXT, Unique, NOT NULL)
├── first_name (TEXT, NOT NULL)
├── field (TEXT, NOT NULL)
├── year_of_study (TEXT, NOT NULL)
├── gender (TEXT, NOT NULL)
├── created_at (TIMESTAMP WITH TIME ZONE)
└── updated_at (TIMESTAMP WITH TIME ZONE)
```

## Usage

Once the table is created, the application will:
1. Check if a user has a profile when they access the dashboard
2. Show a profile completion modal if no profile exists
3. Save the profile data to the `user_profiles` table
4. Use the profile data for personalization features

## Field Options

The application includes predefined options for:

**Fields of Study:**
- Medicine
- Nursing
- Pharmacy
- Dentistry
- Physiotherapy
- Medical Laboratory Sciences
- Radiology
- Public Health
- Biomedical Sciences
- Other

**Years of Study:**
- 1st Year through 6th Year
- Graduate Student
- Resident
- Fellow
- Practicing Professional

**Gender:**
- Male
- Female
- Other
- Prefer not to say 