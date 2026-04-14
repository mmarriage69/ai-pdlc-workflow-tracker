-- Migration 003: Priority fields on step_items
-- Run this in your Supabase SQL Editor after 002_people_teams.sql

ALTER TABLE step_items
  ADD COLUMN IF NOT EXISTS priority_major integer,
  ADD COLUMN IF NOT EXISTS priority_sub   text;
