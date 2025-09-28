-- Database Schema Metadata
-- Create Schema
CREATE SCHEMA portfolio AUTHORIZATION devuser;

-- Drop existing tables
drop table IF EXISTS portfolio.users cascade;

--Master table for inventoryapi users
create table portfolio.users(
    loginid         character varying(20) PRIMARY KEY,
    pwdhash         character varying(100) NOT NULL,
    fullname        character varying(50) NOT NULL, 
    email           character varying(50) NOT NULL,
    email_verified  BOOLEAN DEFAULT 'false',
    profile_image   character varying(100),
    is_active       BOOLEAN DEFAULT 'false',    
    phone_number    character varying(10) NOT NULL,
    phone_verified  BOOLEAN DEFAULT 'false',
    date_of_birth   DATE,
    userrole        character varying(10) NOT NULL DEFAULT 'user',
    last_login      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "createdAt"     TIMESTAMP WITH TIME ZONE,
    "updatedAt"     TIMESTAMP WITH TIME ZONE
);