import { useState, useMemo, useEffect, createContext, useContext } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────
const META = { total: 102, male: 56, female: 46, unique: 126, median_age: 31, age_min: 19, age_max: 60 };
const GROUPS = [
  { name: "Destiny's Child", total: 30, male: 11, female: 19, genre: "R&B / Soul", pct: 29.4 },
  { name: "OutKast", total: 23, male: 16, female: 7, genre: "Hip-Hop / Rap", pct: 22.5 },
  { name: "New Edition", total: 19, male: 9, female: 10, genre: "R&B / Soul", pct: 18.6 },
  { name: "Boyz II Men", total: 17, male: 11, female: 6, genre: "R&B / Soul", pct: 16.7 },
  { name: "Jackson 5", total: 16, male: 9, female: 7, genre: "R&B / Soul", pct: 15.7 },
  { name: "Earth, Wind & Fire", total: 15, male: 8, female: 7, genre: "Funk / Classic", pct: 14.7 },
  { name: "SWV", total: 13, male: 4, female: 9, genre: "R&B / Soul", pct: 12.7 },
  { name: "Wu-Tang Clan", total: 11, male: 8, female: 3, genre: "Hip-Hop / Rap", pct: 10.8 },
  { name: "Migos", total: 11, male: 9, female: 2, genre: "Hip-Hop / Rap", pct: 10.8 },
  { name: "Jodeci", total: 10, male: 5, female: 5, genre: "R&B / Soul", pct: 9.8 },
  { name: "The Temptations", total: 9, male: 6, female: 3, genre: "R&B / Soul", pct: 8.8 },
  { name: "TLC", total: 9, male: 2, female: 7, genre: "R&B / Soul", pct: 8.8 },
  { name: "Queen", total: 8, male: 7, female: 1, genre: "Pop / Rock", pct: 7.8 },
  { name: "NWA", total: 8, male: 6, female: 2, genre: "Hip-Hop / Rap", pct: 7.8 },
  { name: "Paramore", total: 7, male: 3, female: 4, genre: "Pop / Rock", pct: 6.9 },
  { name: "Isley Brothers", total: 7, male: 3, female: 4, genre: "R&B / Soul", pct: 6.9 },
  { name: "The Beatles", total: 6, male: 6, female: 0, genre: "Pop / Rock", pct: 5.9 },
  { name: "Young Money", total: 6, male: 4, female: 2, genre: "Hip-Hop / Rap", pct: 5.9 },
  { name: "Pretty Ricky", total: 6, male: 2, female: 4, genre: "R&B / Soul", pct: 5.9 },
  { name: "Three 6 Mafia", total: 6, male: 5, female: 1, genre: "Hip-Hop / Rap", pct: 5.9 },
  { name: "112", total: 5, male: 1, female: 4, genre: "R&B / Soul", pct: 4.9 },
  { name: "B2K", total: 5, male: 1, female: 4, genre: "R&B / Soul", pct: 4.9 },
  { name: "Xscape", total: 5, male: 0, female: 5, genre: "R&B / Soul", pct: 4.9 },
  { name: "Jagged Edge", total: 5, male: 2, female: 3, genre: "R&B / Soul", pct: 4.9 },
  { name: "Backstreet Boys", total: 4, male: 2, female: 2, genre: "Pop / Rock", pct: 3.9 },
  { name: "NSYNC", total: 4, male: 0, female: 4, genre: "Pop / Rock", pct: 3.9 },
  { name: "G-Unit", total: 4, male: 4, female: 0, genre: "Hip-Hop / Rap", pct: 3.9 },
  { name: "City Girls", total: 4, male: 1, female: 3, genre: "Hip-Hop / Rap", pct: 3.9 },
  { name: "O'Jays", total: 3, male: 0, female: 3, genre: "R&B / Soul", pct: 2.9 },
  { name: "Bone Thugs N Harmony", total: 3, male: 1, female: 2, genre: "Hip-Hop / Rap", pct: 2.9 },
  { name: "Prince & The Revolution", total: 3, male: 2, female: 1, genre: "Funk / Classic", pct: 2.9 },
  { name: "The Clark Sisters", total: 3, male: 0, female: 3, genre: "R&B / Soul", pct: 2.9 },
  { name: "Fall Out Boy", total: 3, male: 2, female: 1, genre: "Pop / Rock", pct: 2.9 },
  { name: "One Direction", total: 3, male: 1, female: 2, genre: "Pop / Rock", pct: 2.9 },
  { name: "UGK", total: 3, male: 2, female: 1, genre: "Hip-Hop / Rap", pct: 2.9 },
  { name: "Sonder", total: 3, male: 2, female: 1, genre: "R&B / Soul", pct: 2.9 },
  { name: "Gap Band", total: 3, male: 3, female: 0, genre: "R&B / Soul", pct: 2.9 },
  { name: "Dru Hill", total: 3, male: 1, female: 2, genre: "R&B / Soul", pct: 2.9 },
  { name: "Black Eyed Peas", total: 3, male: 2, female: 1, genre: "Hip-Hop / Rap", pct: 2.9 },
  { name: "Green Day", total: 3, male: 2, female: 1, genre: "Pop / Rock", pct: 2.9 },
  { name: "Mindless Behavior", total: 2, male: 0, female: 2, genre: "Pop / Rock", pct: 2.0 },
  { name: "Fugees", total: 2, male: 1, female: 1, genre: "Hip-Hop / Rap", pct: 2.0 },
  { name: "Kirk Franklin & Family", total: 2, male: 0, female: 2, genre: "R&B / Soul", pct: 2.0 },
  { name: "Imagine Dragons", total: 2, male: 2, female: 0, genre: "Pop / Rock", pct: 2.0 },
  { name: "Day 26", total: 2, male: 0, female: 2, genre: "R&B / Soul", pct: 2.0 },
  { name: "Gorillaz", total: 2, male: 2, female: 0, genre: "Pop / Rock", pct: 2.0 },
  { name: "A Tribe Called Quest", total: 2, male: 2, female: 0, genre: "Hip-Hop / Rap", pct: 2.0 },
  { name: "Metallica", total: 2, male: 1, female: 1, genre: "Pop / Rock", pct: 2.0 },
  { name: "En Vogue", total: 2, male: 1, female: 1, genre: "R&B / Soul", pct: 2.0 },
  { name: "Hall & Oates", total: 2, male: 2, female: 0, genre: "Funk / Classic", pct: 2.0 },
  { name: "Daft Punk", total: 2, male: 1, female: 1, genre: "Pop / Rock", pct: 2.0 },
  { name: "Cash Money", total: 2, male: 1, female: 1, genre: "Hip-Hop / Rap", pct: 2.0 },
  { name: "Floetry", total: 2, male: 1, female: 1, genre: "R&B / Soul", pct: 2.0 },
  { name: "Bob Marley & The Wailers", total: 1, male: 1, female: 0, genre: "Funk / Classic", pct: 1.0 },
  { name: "Bee Gees", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Barikad Crew", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Crucial Conflict", total: 1, male: 1, female: 0, genre: "R&B / Soul", pct: 1.0 },
  { name: "Thee Sacred Souls", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "H-Town", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "213", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Pentatonix", total: 1, male: 0, female: 1, genre: "Other", pct: 1.0 },
  { name: "Public Enemy", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Nirvana", total: 1, male: 0, female: 1, genre: "Pop / Rock", pct: 1.0 },
  { name: "Maroon 5", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Spice Girls", total: 1, male: 0, female: 1, genre: "Pop / Rock", pct: 1.0 },
  { name: "Public Announcement", total: 1, male: 1, female: 0, genre: "R&B / Soul", pct: 1.0 },
  { name: "Chloe & Halle", total: 1, male: 1, female: 0, genre: "R&B / Soul", pct: 1.0 },
  { name: "Guy", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Mint Condition", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Zenglen", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Immature", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Fifth Harmony", total: 1, male: 1, female: 0, genre: "Other", pct: 1.0 },
  { name: "Clipse", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Coldplay", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Silk", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Beastie Boys", total: 1, male: 0, female: 1, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Brand Nubian", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Goodie Mob", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Dreamville", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Gladys Knight & The Pips", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Crime Mob", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Twenty One Pilots", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Mary Mary", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Fleetwood Mac", total: 1, male: 0, female: 1, genre: "Pop / Rock", pct: 1.0 },
  { name: "The Carters", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Avenged Sevenfold", total: 1, male: 0, female: 1, genre: "Pop / Rock", pct: 1.0 },
  { name: "Lord Huron", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Frankie Beverly & Maze", total: 1, male: 1, female: 0, genre: "R&B / Soul", pct: 1.0 },
  { name: "3LW", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "The Smiths", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "ASAP Mob", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "DSVN", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Boy's World", total: 1, male: 0, female: 1, genre: "Pop / Rock", pct: 1.0 },
  { name: "Panic! at the Disco", total: 1, male: 0, female: 1, genre: "Pop / Rock", pct: 1.0 },
  { name: "Eric B. & Rakim", total: 1, male: 1, female: 0, genre: "Funk / Classic", pct: 1.0 },
  { name: "Ying Yang Twins", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Griselda", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "B5", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "Linkin Park", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Glass Animals", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Cherish", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "MMG", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Junior MAFIA", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "The Stylistics", total: 1, male: 1, female: 0, genre: "R&B / Soul", pct: 1.0 },
  { name: "Concrete Boys", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "5 Seconds of Summer", total: 1, male: 0, female: 1, genre: "Other", pct: 1.0 },
  { name: "The Strokes", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "The Internet", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "TDE", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Chic", total: 1, male: 1, female: 0, genre: "R&B / Soul", pct: 1.0 },
  { name: "Rae Sremmurd", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Run DMC", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Con Funk Shun", total: 1, male: 0, female: 1, genre: "R&B / Soul", pct: 1.0 },
  { name: "The Lox", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Led Zeppelin", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Poor Mans Poison", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "The Supremes", total: 1, male: 1, female: 0, genre: "R&B / Soul", pct: 1.0 },
  { name: "Alabama", total: 1, male: 0, female: 1, genre: "Funk / Classic", pct: 1.0 },
  { name: "YSL", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "Big Time Rush", total: 1, male: 0, female: 1, genre: "Pop / Rock", pct: 1.0 },
  { name: "Arctic Monkeys", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "The Cab", total: 1, male: 0, female: 1, genre: "Pop / Rock", pct: 1.0 },
  { name: "EarthGang", total: 1, male: 1, female: 0, genre: "Hip-Hop / Rap", pct: 1.0 },
  { name: "She Wants Revenge", total: 1, male: 1, female: 0, genre: "Pop / Rock", pct: 1.0 },
  { name: "Paris, Texas", total: 1, male: 1, female: 0, genre: "Other", pct: 1.0 },
];
const GENRE_TOTALS = { "R&B / Soul": 200, "Hip-Hop / Rap": 108, "Pop / Rock": 72, "Funk / Classic": 23, "Other": 5 };
const GENRE_BY_GENDER = {
  male: { "R&B / Soul": 81, "Hip-Hop / Rap": 81, "Pop / Rock": 45, "Funk / Classic": 14, "Other": 3 },
  female: { "R&B / Soul": 119, "Hip-Hop / Rap": 27, "Pop / Rock": 27, "Funk / Classic": 9, "Other": 2 }
};
const BRACKETS = {
  "18–24": { count: 8, top: [{ name: "OutKast", n: 3 }, { name: "SWV", n: 2 }, { name: "A Tribe Called Quest", n: 1 }, { name: "Destiny's Child", n: 1 }] },
  "25–29": { count: 32, top: [{ name: "Destiny's Child", n: 14 }, { name: "Migos", n: 6 }, { name: "Wu-Tang Clan", n: 5 }, { name: "Boyz II Men", n: 5 }, { name: "Paramore", n: 4 }, { name: "OutKast", n: 4 }] },
  "30–34": { count: 34, top: [{ name: "Destiny's Child", n: 12 }, { name: "OutKast", n: 10 }, { name: "Jackson 5", n: 7 }, { name: "Boyz II Men", n: 6 }, { name: "Earth, Wind & Fire", n: 6 }] },
  "35–39": { count: 9, top: [{ name: "New Edition", n: 3 }, { name: "The Temptations", n: 2 }, { name: "Jodeci", n: 2 }, { name: "OutKast", n: 2 }, { name: "Backstreet Boys", n: 2 }] },
  "40+":   { count: 19, top: [{ name: "New Edition", n: 9 }, { name: "Jackson 5", n: 5 }, { name: "Earth, Wind & Fire", n: 5 }, { name: "OutKast", n: 4 }, { name: "Xscape", n: 4 }] }
};
const GENRE_BY_BRACKET = {
  "18–24": { "R&B / Soul": 12, "Pop / Rock": 12, "Hip-Hop / Rap": 8 },
  "25–29": { "R&B / Soul": 58, "Pop / Rock": 24, "Hip-Hop / Rap": 39, "Other": 3, "Funk / Classic": 4 },
  "30–34": { "R&B / Soul": 63, "Pop / Rock": 26, "Hip-Hop / Rap": 37, "Funk / Classic": 8, "Other": 2 },
  "35–39": { "R&B / Soul": 20, "Hip-Hop / Rap": 8, "Pop / Rock": 7, "Funk / Classic": 1 },
  "40+":   { "R&B / Soul": 47, "Hip-Hop / Rap": 16, "Pop / Rock": 3, "Funk / Classic": 10 },
};
const MEDIAN_AGES = [
  { name: "City Girls", median: 28 },{ name: "Jagged Edge", median: 28 },
  { name: "Three 6 Mafia", median: 29 },{ name: "112", median: 29 },
  { name: "Pretty Ricky", median: 29 },{ name: "Migos", median: 29 },
  { name: "Isley Brothers", median: 29 },{ name: "Paramore", median: 29 },
  { name: "Wu-Tang Clan", median: 30 },{ name: "Destiny's Child", median: 30 },
  { name: "OutKast", median: 30 },{ name: "Boyz II Men", median: 31 },
  { name: "Jackson 5", median: 32 },{ name: "Queen", median: 32 },
  { name: "The Beatles", median: 32 },{ name: "Earth, Wind & Fire", median: 33 },
  { name: "NWA", median: 33 },{ name: "TLC", median: 33 },
  { name: "Jodeci", median: 35 },{ name: "New Edition", median: 35 },
  { name: "Xscape", median: 42 },
];
const RESPONDENTS = [
  { num: 101, gender: "Female", age: 26, picks: ["Destiny's Child","Jackson 5","Boyz II Men","Jodeci"], score: 73 },
  { num: 84, gender: "Female", age: 26, picks: ["Destiny's Child","OutKast","Three 6 Mafia","SWV"], score: 72 },
  { num: 33, gender: "Female", age: 31, picks: ["Destiny's Child","SWV","B2K","OutKast"], score: 71 },
  { num: 58, gender: "Female", age: 30, picks: ["Migos","Destiny's Child","OutKast","Young Money"], score: 70 },
  { num: 16, gender: "Male", age: 30, picks: ["Boyz II Men","Destiny's Child","TLC","SWV"], score: 69 },
  { num: 99, gender: "Male", age: 32, picks: ["Jackson 5","B2K","Boyz II Men","Destiny's Child"], score: 68 },
  { num: 26, gender: "Male", age: 30, picks: ["Earth, Wind & Fire","New Edition","UGK","Destiny's Child"], score: 67 },
  { num: 76, gender: "Male", age: 27, picks: ["Migos","OutKast","Jackson 5","Boyz II Men"], score: 67 },
  { num: 22, gender: "Male", age: 47, picks: ["Earth, Wind & Fire","OutKast","Wu-Tang Clan","Jackson 5"], score: 65 },
  { num: 62, gender: "Male", age: 28, picks: ["OutKast","Boyz II Men","Jagged Edge","New Edition"], score: 64 },
  { num: 57, gender: "Female", age: 33, picks: ["OutKast","Destiny's Child","Panic! at the Disco","TLC"], score: 63 },
  { num: 15, gender: "Female", age: 29, picks: ["Destiny's Child","Migos","Boyz II Men","City Girls"], score: 62 },
  { num: 86, gender: "Female", age: 21, picks: ["OutKast","Isley Brothers","SWV","New Edition"], score: 62 },
  { num: 20, gender: "Female", age: 20, picks: ["Destiny's Child","UGK","Jagged Edge","OutKast"], score: 61 },
  { num: 77, gender: "Male", age: 52, picks: ["Boyz II Men","En Vogue","New Edition","OutKast"], score: 61 },
  { num: 1, gender: "Female", age: 29, picks: ["New Edition","Destiny's Child","The Temptations","Kirk Franklin & Family"], score: 60 },
  { num: 85, gender: "Female", age: 47, picks: ["Earth, Wind & Fire","Jackson 5","New Edition","TLC"], score: 59 },
  { num: 46, gender: "Male", age: 28, picks: ["Queen","Destiny's Child","New Edition","The Internet"], score: 58 },
  { num: 60, gender: "Female", age: 28, picks: ["Destiny's Child","Jagged Edge","Boyz II Men","Pretty Ricky"], score: 58 },
  { num: 18, gender: "Male", age: 30, picks: ["OutKast","UGK","New Edition","Wu-Tang Clan"], score: 56 },
  { num: 6, gender: "Female", age: 35, picks: ["New Edition","Destiny's Child","3LW","112"], score: 55 },
  { num: 9, gender: "Male", age: 34, picks: ["The Temptations","Pretty Ricky","Destiny's Child","Jodeci"], score: 55 },
  { num: 12, gender: "Male", age: 30, picks: ["Jackson 5","Earth, Wind & Fire","OutKast","The Stylistics"], score: 55 },
  { num: 30, gender: "Male", age: 33, picks: ["Earth, Wind & Fire","OutKast","NWA","The Temptations"], score: 55 },
  { num: 74, gender: "Male", age: 33, picks: ["Jackson 5","Destiny's Child","Queen","The Supremes"], score: 55 },
  { num: 53, gender: "Female", age: 41, picks: ["Jackson 5","Bone Thugs N Harmony","Earth, Wind & Fire","New Edition"], score: 53 },
  { num: 21, gender: "Female", age: 41, picks: ["Jackson 5","Immature","Destiny's Child","Xscape"], score: 52 },
  { num: 44, gender: "Female", age: 50, picks: ["New Edition","Silk","OutKast","TLC"], score: 52 },
  { num: 66, gender: "Male", age: 35, picks: ["OutKast","The Temptations","New Edition","The Lox"], score: 52 },
  { num: 27, gender: "Male", age: 31, picks: ["Jackson 5","Gap Band","Destiny's Child","Metallica"], score: 51 },
  { num: 28, gender: "Male", age: 31, picks: ["Destiny's Child","Backstreet Boys","The Temptations","Isley Brothers"], score: 50 },
  { num: 29, gender: "Female", age: 29, picks: ["Jackson 5","One Direction","Destiny's Child","5 Seconds of Summer"], score: 50 },
  { num: 32, gender: "Male", age: 35, picks: ["SWV","New Edition","Isley Brothers","Migos"], score: 50 },
  { num: 55, gender: "Female", age: 32, picks: ["Pretty Ricky","The Temptations","New Edition","Jackson 5"], score: 50 },
  { num: 88, gender: "Male", age: 35, picks: ["Jodeci","Boyz II Men","NWA","Earth, Wind & Fire"], score: 50 },
  { num: 3, gender: "Male", age: 53, picks: ["New Edition","Jackson 5","Frankie Beverly & Maze","SWV"], score: 49 },
  { num: 65, gender: "Female", age: 37, picks: ["The Temptations","Gladys Knight & The Pips","Destiny's Child","TLC"], score: 49 },
  { num: 83, gender: "Female", age: 29, picks: ["Queen","Destiny's Child","NWA","Green Day"], score: 49 },
  { num: 31, gender: "Female", age: 28, picks: ["Paramore","Destiny's Child","City Girls","Isley Brothers"], score: 48 },
  { num: 2, gender: "Male", age: 33, picks: ["The Beatles","Fall Out Boy","OutKast","Earth, Wind & Fire"], score: 47 },
  { num: 40, gender: "Female", age: 33, picks: ["Destiny's Child","Day 26","Jagged Edge","TLC"], score: 46 },
  { num: 50, gender: "Male", age: 30, picks: ["OutKast","NWA","Migos","G-Unit"], score: 46 },
  { num: 51, gender: "Female", age: 29, picks: ["Wu-Tang Clan","Isley Brothers","SWV","Earth, Wind & Fire"], score: 46 },
  { num: 7, gender: "Female", age: 50, picks: ["Wu-Tang Clan","Boyz II Men","SWV","O'Jays"], score: 44 },
  { num: 67, gender: "Female", age: 49, picks: ["The Clark Sisters","New Edition","Xscape","Earth, Wind & Fire"], score: 42 },
  { num: 71, gender: "Male", age: 38, picks: ["Three 6 Mafia","Wu-Tang Clan","Cash Money","OutKast"], score: 42 },
  { num: 59, gender: "Male", age: 30, picks: ["Migos","OutKast","Young Money","Rae Sremmurd"], score: 41 },
  { num: 95, gender: "Male", age: 32, picks: ["The Beatles","Jackson 5","Wu-Tang Clan","Queen"], score: 41 },
  { num: 13, gender: "Male", age: 40, picks: ["Bone Thugs N Harmony","Queen","The Beatles","OutKast"], score: 40 },
  { num: 69, gender: "Female", age: 23, picks: ["SWV","112","Boyz II Men","Xscape"], score: 40 },
  { num: 24, gender: "Female", age: 47, picks: ["H-Town","Jodeci","TLC","New Edition"], score: 39 },
  { num: 38, gender: "Female", age: 28, picks: ["Pentatonix","NSYNC","City Girls","Destiny's Child"], score: 39 },
  { num: 42, gender: "Male", age: 27, picks: ["The Beatles","The Temptations","OutKast","The Strokes"], score: 39 },
  { num: 80, gender: "Female", age: 27, picks: ["Destiny's Child","112","Mindless Behavior","Big Time Rush"], score: 38 },
  { num: 4, gender: "Female", age: 28, picks: ["Mindless Behavior","Destiny's Child","One Direction","Cherish"], score: 36 },
  { num: 17, gender: "Male", age: 33, picks: ["Crucial Conflict","NWA","Jackson 5","Wu-Tang Clan"], score: 36 },
  { num: 70, gender: "Male", age: 37, picks: ["Queen","Jodeci","Boyz II Men","Led Zeppelin"], score: 36 },
  { num: 93, gender: "Male", age: 25, picks: ["Chloe & Halle","The Carters","City Girls","Destiny's Child"], score: 36 },
  { num: 41, gender: "Male", age: 19, picks: ["OutKast","Coldplay","Daft Punk","TLC"], score: 35 },
  { num: 34, gender: "Male", age: 31, picks: ["Destiny's Child","Fifth Harmony","Flo","Imagine Dragons"], score: 34 },
  { num: 54, gender: "Male", age: 30, picks: ["OutKast","Goodie Mob","G-Unit","Young Money"], score: 34 },
  { num: 68, gender: "Male", age: 27, picks: ["Destiny's Child","Crime Mob","Ying Yang Twins","Floetry"], score: 34 },
  { num: 81, gender: "Male", age: 29, picks: ["Queen","NWA","Migos","Paramore"], score: 34 },
  { num: 39, gender: "Male", age: 33, picks: ["Jodeci","Dru Hill","Boyz II Men","Gap Band"], score: 33 },
  { num: 98, gender: "Male", age: 30, picks: ["Earth, Wind & Fire","Queen","Isley Brothers","Gap Band"], score: 33 },
  { num: 64, gender: "Female", age: 28, picks: ["Earth, Wind & Fire","TLC","Paramore","Con Funk Shun"], score: 32 },
  { num: 25, gender: "Female", age: 44, picks: ["Jodeci","Xscape","Dru Hill","SWV"], score: 31 },
  { num: 8, gender: "Female", age: 29, picks: ["O'Jays","Mint Condition","Wu-Tang Clan","Earth, Wind & Fire"], score: 30 },
  { num: 19, gender: "Female", age: 29, picks: ["112","SWV","Young Money","Pretty Ricky"], score: 30 },
  { num: 91, gender: "Female", age: 30, picks: ["B2K","Jodeci","SWV","Cash Money"], score: 30 },
  { num: 35, gender: "Female", age: 42, picks: ["Jodeci","Fugees","Earth, Wind & Fire","Floetry"], score: 29 },
  { num: 78, gender: "Female", age: 42, picks: ["New Edition","Mary Mary","Xscape","Bone Thugs N Harmony"], score: 28 },
  { num: 52, gender: "Male", age: 29, picks: ["Migos","112","Jagged Edge","Three 6 Mafia"], score: 27 },
  { num: 10, gender: "Male", age: 34, picks: ["Bob Marley & The Wailers","The Beatles","Boyz II Men","Junior MAFIA"], score: 25 },
  { num: 87, gender: "Female", age: 35, picks: ["Spice Girls","Backstreet Boys","NSYNC","Jackson 5"], score: 25 },
  { num: 89, gender: "Male", age: 54, picks: ["Public Announcement","NWA","SWV","Prince & The Revolution"], score: 25 },
  { num: 72, gender: "Male", age: 32, picks: ["Boyz II Men","Sonder","Griselda","Green Day"], score: 24 },
  { num: 92, gender: "Male", age: 30, picks: ["Three 6 Mafia","G-Unit","Migos","Fall Out Boy"], score: 24 },
  { num: 11, gender: "Male", age: 32, picks: ["Barikad Crew","Zenglen","Backstreet Boys","Boyz II Men"], score: 23 },
  { num: 61, gender: "Male", age: 50, picks: ["New Edition","A Tribe Called Quest","Eric B. & Rakim","Run DMC"], score: 23 },
  { num: 75, gender: "Female", age: 56, picks: ["Boyz II Men","Metallica","The Clark Sisters","Alabama"], score: 23 },
  { num: 43, gender: "Male", age: 27, picks: ["Wu-Tang Clan","G-Unit","ASAP Mob","Three 6 Mafia"], score: 22 },
  { num: 47, gender: "Male", age: 28, picks: ["Prince & The Revolution","Paramore","Wu-Tang Clan","TDE"], score: 22 },
  { num: 37, gender: "Male", age: 28, picks: ["213","Migos","Black Eyed Peas","Three 6 Mafia"], score: 21 },
  { num: 56, gender: "Male", age: 32, picks: ["Maroon 5","Black Eyed Peas","Paramore","Jodeci"], score: 21 },
  { num: 36, gender: "Male", age: 33, picks: ["Fugees","Clipse","Hall & Oates","Earth, Wind & Fire"], score: 20 },
  { num: 82, gender: "Male", age: 26, picks: ["The Beatles","Wu-Tang Clan","Gorillaz","Arctic Monkeys"], score: 20 },
  { num: 5, gender: "Male", age: 28, picks: ["Young Money","One Direction","The Temptations","MMG"], score: 19 },
  { num: 63, gender: "Female", age: 26, picks: ["Isley Brothers","Dreamville","Pretty Ricky","O'Jays"], score: 17 },
  { num: 79, gender: "Male", age: 29, picks: ["Young Money","Pretty Ricky","Green Day","YSL"], score: 16 },
  { num: 97, gender: "Male", age: 29, picks: ["Gorillaz","Paris, Texas","Linkin Park","Migos"], score: 15 },
  { num: 14, gender: "Female", age: 49, picks: ["Bee Gees","Prince & The Revolution","En Vogue","NWA"], score: 14 },
  { num: 94, gender: "Female", age: 32, picks: ["Paramore","B2K","B5","The Cab"], score: 14 },
  { num: 96, gender: "Female", age: 32, picks: ["Day 26","Avenged Sevenfold","Paramore","The Clark Sisters"], score: 13 },
  { num: 102, gender: "Female", age: 36, picks: ["Guy","Dru Hill","Backstreet Boys","NSYNC"], score: 12 },
  { num: 49, gender: "Female", age: 24, picks: ["Nirvana","B2K","Boy's World","Black Eyed Peas"], score: 10 },
  { num: 90, gender: "Female", age: 33, picks: ["Fall Out Boy","Fleetwood Mac","NSYNC","Daft Punk"], score: 10 },
  { num: 45, gender: "Female", age: 29, picks: ["Kirk Franklin & Family","Beastie Boys","DSVN","Sonder"], score: 7 },
  { num: 23, gender: "Male", age: 19, picks: ["Thee Sacred Souls","Sonder","The Smiths","Concrete Boys"], score: 6 },
  { num: 48, gender: "Male", age: 60, picks: ["Public Enemy","Brand Nubian","Hall & Oates","Chic"], score: 5 },
  { num: 73, gender: "Male", age: 21, picks: ["Imagine Dragons","Twenty One Pilots","She Wants Revenge","Poor Mans Poison"], score: 5 },
  { num: 100, gender: "Male", age: 19, picks: ["A Tribe Called Quest","Lord Huron","Glass Animals","EarthGang"], score: 5 },
];

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const BG='#07101F',SURF='#0C1828',SURF2='#0F1E35',BORDER='#152538',BORDER2='#1D3050';
const TEXT='#C8DFF0',MUTED='#506A88',DIM='#2A4560',AMBER='#F5C430',TEAL='#1FCFB0';
const MONO='"IBM Plex Mono",monospace',COND='"Barlow Condensed",sans-serif',BODY='"Space Grotesk",sans-serif';
const GENRE_COLOR={'R&B / Soul':AMBER,'Hip-Hop / Rap':TEAL,'Pop / Rock':'#8B9FE8','Funk / Classic':'#E8875D','Other':'#6B7A8D'};

// ─── MOBILE CONTEXT ──────────────────────────────────────────────────────────
const MobileCtx = createContext(false);
const useMobile = () => useContext(MobileCtx);
function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return m;
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Mono = ({ children, size=10, color=MUTED, style={} }) => (
  <span style={{ fontFamily:MONO, fontSize:size, letterSpacing:'0.14em', color, ...style }}>{children}</span>
);
const Label = ({ children, color=MUTED }) => (
  <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color, marginBottom:8 }}>{children}</div>
);
const Card = ({ children, style={} }) => (
  <div style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:3, padding:'20px 22px', ...style }}>{children}</div>
);
const GenreTag = ({ genre }) => (
  <span style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:GENRE_COLOR[genre]||MUTED, border:`1px solid ${GENRE_COLOR[genre]||MUTED}`, borderRadius:2, padding:'2px 6px', opacity:0.85, whiteSpace:'nowrap' }}>{genre}</span>
);
const SectionDivider = ({ label }) => (
  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
    <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:AMBER, whiteSpace:'nowrap' }}>// {label}</div>
    <div style={{ flex:1, height:1, background:BORDER }} />
  </div>
);
const StatCard = ({ label, value, sub }) => (
  <Card>
    <Label>{label}</Label>
    <div style={{ fontFamily:COND, fontSize:48, fontWeight:700, color:AMBER, lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontFamily:MONO, fontSize:10, color:MUTED, marginTop:6 }}>{sub}</div>}
  </Card>
);
const AppearanceBar = ({ pct, color=AMBER, height=3 }) => (
  <div style={{ height, background:BORDER, marginBottom:5 }}>
    <div style={{ height, width:`${pct}%`, background:color }} />
  </div>
);

// ─── TAB: OVERVIEW ───────────────────────────────────────────────────────────
function TabOverview() {
  const m = useMobile();
  const top10 = GROUPS.slice(0,10);
  const genreData = Object.entries(GENRE_TOTALS).map(([name,value])=>({name,value,color:GENRE_COLOR[name]}));
  const totalPicks = Object.values(GENRE_TOTALS).reduce((a,b)=>a+b,0);
  const pad = m ? '20px 16px' : '36px 48px';
  return (
    <div style={{ padding:pad }}>
      <div style={{ display:'grid', gridTemplateColumns:m?'1fr 1fr':'repeat(4,1fr)', gap:12, marginBottom:32 }}>
        <StatCard label="Respondents" value={102} sub="Ages 19–60" />
        <StatCard label="Groups Named" value={126} sub="5 genres" />
        <StatCard label="Avg. Age" value={31} sub="Range 19–60" />
        <Card>
          <Label>Gender Split</Label>
          <div style={{ fontFamily:COND, fontSize:48, fontWeight:700, color:AMBER, lineHeight:1 }}>56/46</div>
          <div style={{ fontFamily:MONO, fontSize:10, color:MUTED, marginTop:6 }}>M / F</div>
        </Card>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:m?'1fr':'1fr 300px', gap:28 }}>
        <div>
          <SectionDivider label="Top 10 Groups by Appearances" />
          {top10.map((g,i)=>(
            <div key={g.name} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ width:m?130:175, textAlign:'right', fontFamily:BODY, fontSize:m?11:13, color:i===0?TEXT:MUTED, flexShrink:0, lineHeight:1.3 }}>{g.name}</div>
              <div style={{ flex:1, height:18, background:BORDER, borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${(g.total/top10[0].total)*100}%`, background:i===0?AMBER:i<3?AMBER+'AA':DIM, borderRadius:2 }} />
              </div>
              <div style={{ fontFamily:MONO, fontSize:11, color:i===0?AMBER:MUTED, minWidth:20, textAlign:'right' }}>{g.total}</div>
            </div>
          ))}
        </div>
        <div>
          <SectionDivider label="Genre Breakdown" />
          <div style={{ display:'flex', justifyContent:'center' }}>
            <PieChart width={160} height={160}>
              <Pie data={genreData} cx={80} cy={80} innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={2}>
                {genreData.map((g,i)=><Cell key={i} fill={g.color}/>)}
              </Pie>
              <Tooltip formatter={(v)=>[`${v} picks (${Math.round(v/totalPicks*100)}%)`,'']}/> 
            </PieChart>
          </div>
          <div style={{ marginTop:8 }}>
            {genreData.map(g=>(
              <div key={g.name} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <div style={{ width:8, height:8, borderRadius:1, background:g.color, flexShrink:0 }}/>
                <div style={{ flex:1, fontFamily:BODY, fontSize:12, color:TEXT }}>{g.name}</div>
                <div style={{ fontFamily:MONO, fontSize:11, color:g.color }}>{Math.round(g.value/totalPicks*100)}%</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, padding:'14px 16px', borderLeft:`3px solid ${AMBER}`, background:SURF2 }}>
            <div style={{ fontFamily:MONO, fontSize:10, color:AMBER, letterSpacing:'0.14em', marginBottom:6 }}>// Signal</div>
            <div style={{ fontFamily:BODY, fontSize:13, color:TEXT, lineHeight:1.6 }}>
              Destiny's Child appeared on <span style={{ color:AMBER, fontWeight:600 }}>30 of 102</span> lists. No group came close.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: THE GROUPS ─────────────────────────────────────────────────────────
function TabGroups() {
  const m = useMobile();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const genres = ['All','R&B / Soul','Hip-Hop / Rap','Pop / Rock','Funk / Classic','Other'];
  const filtered = useMemo(()=>GROUPS.filter(g=>{
    const ms = g.name.toLowerCase().includes(search.toLowerCase());
    const mf = filter==='All'||g.genre===filter;
    return ms&&mf;
  }),[search,filter]);
  const max = GROUPS[0].total;
  const pad = m ? '20px 16px' : '36px 48px';
  return (
    <div style={{ padding:pad }}>
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search groups..."
          style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:3, padding:'8px 12px', fontFamily:BODY, fontSize:13, color:TEXT, outline:'none', width:m?'100%':200 }}/>
        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
          {genres.map(g=>(
            <button key={g} onClick={()=>setFilter(g)} style={{
              padding:'6px 10px', background:filter===g?AMBER:'transparent',
              border:`1px solid ${filter===g?AMBER:BORDER}`, color:filter===g?BG:MUTED,
              fontFamily:MONO, fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase',
              cursor:'pointer', borderRadius:2,
            }}>{g==='All'?'All':g.split(' / ')[0]}</button>
          ))}
        </div>
        <div style={{ fontFamily:MONO, fontSize:10, color:DIM, alignSelf:'center', marginLeft:'auto' }}>{filtered.length} groups</div>
      </div>
      {/* Header */}
      <div style={{ display:'grid', gridTemplateColumns:m?'32px 1fr 44px':'40px 1fr 140px 80px 70px', gap:10, padding:'0 12px 8px', borderBottom:`1px solid ${BORDER}` }}>
        {(m?['#','Group','Picks']:['#','Group','Genre','Picks','% Pool']).map(h=>(
          <div key={h} style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:DIM }}>{h}</div>
        ))}
      </div>
      {filtered.map((g,i)=>{
        const rank = GROUPS.indexOf(g)+1;
        return (
          <div key={g.name} style={{ display:'grid', gridTemplateColumns:m?'32px 1fr 44px':'40px 1fr 140px 80px 70px', gap:10, padding:'12px 12px', borderBottom:`1px solid ${BORDER}`, background:i%2===0?'transparent':'rgba(255,255,255,0.01)', alignItems:'center' }}>
            <div style={{ fontFamily:MONO, fontSize:10, color:rank===1?AMBER:DIM }}>{rank}</div>
            <div>
              <div style={{ fontFamily:BODY, fontSize:m?12:14, fontWeight:500, color:TEXT, marginBottom:4 }}>{g.name}</div>
              <AppearanceBar pct={(g.total/max)*100} color={rank===1?AMBER:GENRE_COLOR[g.genre]+'80'}/>
              <div style={{ display:'flex', gap:6 }}>
                {g.male>0&&<Mono size={9} color={TEAL+'CC'}>M:{g.male}</Mono>}
                {g.female>0&&<Mono size={9} color={AMBER+'CC'}>F:{g.female}</Mono>}
              </div>
            </div>
            {!m&&<GenreTag genre={g.genre}/>}
            <div style={{ fontFamily:COND, fontSize:m?20:24, fontWeight:700, color:rank===1?AMBER:TEXT }}>{g.total}</div>
            {!m&&<div style={{ fontFamily:MONO, fontSize:11, color:MUTED }}>{g.pct}%</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── TAB: GENRE ──────────────────────────────────────────────────────────────
function TabGenre() {
  const m = useMobile();
  const total = Object.values(GENRE_TOTALS).reduce((a,b)=>a+b,0);
  const maleTotal = Object.values(GENRE_BY_GENDER.male).reduce((a,b)=>a+b,0);
  const femaleTotal = Object.values(GENRE_BY_GENDER.female).reduce((a,b)=>a+b,0);
  const genres = Object.keys(GENRE_TOTALS);
  const brackets = ["18–24","25–29","30–34","35–39","40+"];
  const pad = m ? '20px 16px' : '36px 48px';
  return (
    <div style={{ padding:pad }}>
      <div style={{ display:'grid', gridTemplateColumns:m?'1fr':'1fr 1fr', gap:28 }}>
        <div>
          <SectionDivider label="All Picks by Genre"/>
          {genres.map(g=>(
            <div key={g} style={{ marginBottom:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:1, background:GENRE_COLOR[g] }}/>
                  <span style={{ fontFamily:BODY, fontSize:13, color:TEXT }}>{g}</span>
                </div>
                <div style={{ display:'flex', gap:12 }}>
                  <Mono size={11} color={TEXT}>{GENRE_TOTALS[g]}</Mono>
                  <Mono size={11} color={MUTED}>{Math.round(GENRE_TOTALS[g]/total*100)}%</Mono>
                </div>
              </div>
              <AppearanceBar pct={GENRE_TOTALS[g]/total*100} color={GENRE_COLOR[g]} height={6}/>
            </div>
          ))}
        </div>
        <div>
          <SectionDivider label="Genre by Gender"/>
          {genres.map(g=>{
            const mPct=Math.round((GENRE_BY_GENDER.male[g]||0)/maleTotal*100);
            const fPct=Math.round((GENRE_BY_GENDER.female[g]||0)/femaleTotal*100);
            return (
              <div key={g} style={{ marginBottom:18 }}>
                <div style={{ fontFamily:BODY, fontSize:13, color:TEXT, marginBottom:8 }}>{g}</div>
                <div style={{ marginBottom:5 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <Mono size={10} color={TEAL}>Male</Mono><Mono size={10} color={TEAL}>{mPct}%</Mono>
                  </div>
                  <AppearanceBar pct={mPct} color={TEAL} height={4}/>
                </div>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <Mono size={10} color={AMBER}>Female</Mono><Mono size={10} color={AMBER}>{fPct}%</Mono>
                  </div>
                  <AppearanceBar pct={fPct} color={AMBER} height={4}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop:36 }}>
        <SectionDivider label="Genre Dominance by Age Group"/>
        <div style={{ display:'grid', gridTemplateColumns:m?'1fr 1fr':'repeat(5,1fr)', gap:10 }}>
          {brackets.map(b=>{
            const bData=GENRE_BY_BRACKET[b]||{};
            const bTotal=Object.values(bData).reduce((a,v)=>a+v,0);
            const sorted=Object.entries(bData).sort((a,b)=>b[1]-a[1]);
            return (
              <Card key={b} style={{ padding:'14px 16px' }}>
                <div style={{ fontFamily:COND, fontSize:18, fontWeight:700, color:AMBER, marginBottom:2 }}>{b}</div>
                <div style={{ fontFamily:MONO, fontSize:10, color:DIM, marginBottom:12 }}>{BRACKETS[b]?.count} respondents</div>
                {sorted.map(([genre,cnt])=>(
                  <div key={genre} style={{ marginBottom:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                      <span style={{ fontFamily:MONO, fontSize:9, color:GENRE_COLOR[genre]||MUTED }}>{genre.split(' / ')[0]}</span>
                      <span style={{ fontFamily:MONO, fontSize:9, color:MUTED }}>{Math.round(cnt/bTotal*100)}%</span>
                    </div>
                    <AppearanceBar pct={cnt/bTotal*100} color={GENRE_COLOR[genre]||MUTED} height={3}/>
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: AGE ────────────────────────────────────────────────────────────────
function TabAge() {
  const m = useMobile();
  const bracketKeys = ["18–24","25–29","30–34","35–39","40+"];
  const pad = m ? '20px 16px' : '36px 48px';
  return (
    <div style={{ padding:pad }}>
      <SectionDivider label="Respondents by Age Group"/>
      <div style={{ display:'grid', gridTemplateColumns:m?'repeat(3,1fr)':'repeat(5,1fr)', gap:10, marginBottom:32 }}>
        {bracketKeys.map(b=>(
          <Card key={b} style={{ textAlign:'center', padding:'16px 12px' }}>
            <div style={{ fontFamily:COND, fontSize:32, fontWeight:700, color:AMBER }}>{BRACKETS[b].count}</div>
            <div style={{ fontFamily:MONO, fontSize:10, color:MUTED, letterSpacing:'0.12em' }}>{b}</div>
          </Card>
        ))}
      </div>
      <SectionDivider label="Top Picks by Age Group"/>
      <div style={{ display:'grid', gridTemplateColumns:m?'1fr 1fr':'repeat(5,1fr)', gap:10, marginBottom:36 }}>
        {bracketKeys.map(b=>(
          <Card key={b} style={{ padding:'14px 16px' }}>
            <div style={{ fontFamily:COND, fontSize:16, fontWeight:700, color:AMBER, marginBottom:12 }}>{b}</div>
            {BRACKETS[b].top.slice(0,5).map((item,i)=>(
              <div key={item.name} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${BORDER}` }}>
                <div style={{ fontFamily:BODY, fontSize:11, color:i===0?TEXT:MUTED, paddingRight:4 }}>{item.name}</div>
                <div style={{ fontFamily:MONO, fontSize:10, color:i===0?AMBER:DIM, flexShrink:0 }}>{item.n}</div>
              </div>
            ))}
          </Card>
        ))}
      </div>
      <SectionDivider label="Fan Age by Group"/>
      <div style={{ display:'grid', gridTemplateColumns:m?'1fr':'1fr 1fr', gap:28 }}>
        <div>
          <Label color={TEAL}>Youngest Fans</Label>
          {MEDIAN_AGES.slice(0,10).map(g=>(
            <div key={g.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ fontFamily:BODY, fontSize:13, color:TEXT, flex:1 }}>{g.name}</div>
              <div style={{ fontFamily:COND, fontSize:22, fontWeight:700, color:TEAL, minWidth:40, textAlign:'right' }}>{g.median}</div>
            </div>
          ))}
        </div>
        <div>
          <Label color={AMBER}>Eldest Fans</Label>
          {MEDIAN_AGES.slice(-10).reverse().map(g=>(
            <div key={g.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ fontFamily:BODY, fontSize:13, color:TEXT, flex:1 }}>{g.name}</div>
              <div style={{ fontFamily:COND, fontSize:22, fontWeight:700, color:AMBER, minWidth:40, textAlign:'right' }}>{g.median}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: GENDER ─────────────────────────────────────────────────────────────
function TabGender() {
  const m = useMobile();
  const topMale = GROUPS.filter(g=>g.male>0).sort((a,b)=>b.male-a.male).slice(0,12);
  const topFemale = GROUPS.filter(g=>g.female>0).sort((a,b)=>b.female-a.female).slice(0,12);
  const maxM = topMale[0].male, maxF = topFemale[0].female;
  const skewed = GROUPS.filter(g=>g.total>=3).map(g=>({...g,skew:g.total>0?(g.female-g.male)/g.total:0})).sort((a,b)=>b.skew-a.skew);
  const femaleSkewed = skewed.slice(0,5);
  const maleSkewed = [...skewed].sort((a,b)=>a.skew-b.skew).slice(0,5);
  const pad = m ? '20px 16px' : '36px 48px';
  return (
    <div style={{ padding:pad }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
        <Card style={{ textAlign:'center' }}>
          <div style={{ fontFamily:COND, fontSize:m?40:52, fontWeight:900, color:TEAL }}>56</div>
          <div style={{ fontFamily:MONO, fontSize:10, color:MUTED }}>Male</div>
        </Card>
        <Card style={{ textAlign:'center' }}>
          <div style={{ fontFamily:COND, fontSize:m?40:52, fontWeight:900, color:AMBER }}>46</div>
          <div style={{ fontFamily:MONO, fontSize:10, color:MUTED }}>Female</div>
        </Card>
      </div>
      <SectionDivider label="Top Picks by Gender"/>
      <div style={{ display:'grid', gridTemplateColumns:m?'1fr':'1fr 1fr', gap:24, marginBottom:36 }}>
        <div>
          <Label color={TEAL}>Male</Label>
          {topMale.map((g,i)=>(
            <div key={g.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ fontFamily:MONO, fontSize:10, color:DIM, minWidth:18 }}>{String(i+1).padStart(2,'0')}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:BODY, fontSize:13, color:TEXT, marginBottom:4 }}>{g.name}</div>
                <AppearanceBar pct={(g.male/maxM)*100} color={TEAL}/>
              </div>
              <div style={{ fontFamily:COND, fontSize:20, fontWeight:700, color:i===0?TEAL:MUTED }}>{g.male}</div>
            </div>
          ))}
        </div>
        <div>
          <Label color={AMBER}>Female</Label>
          {topFemale.map((g,i)=>(
            <div key={g.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ fontFamily:MONO, fontSize:10, color:DIM, minWidth:18 }}>{String(i+1).padStart(2,'0')}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:BODY, fontSize:13, color:TEXT, marginBottom:4 }}>{g.name}</div>
                <AppearanceBar pct={(g.female/maxF)*100} color={AMBER}/>
              </div>
              <div style={{ fontFamily:COND, fontSize:20, fontWeight:700, color:i===0?AMBER:MUTED }}>{g.female}</div>
            </div>
          ))}
        </div>
      </div>
      <SectionDivider label="Strongest Gender Skews"/>
      <div style={{ display:'grid', gridTemplateColumns:m?'1fr':'1fr 1fr', gap:24 }}>
        <div>
          <Label color={AMBER}>Female-Dominant</Label>
          {femaleSkewed.map(g=>(
            <div key={g.name} style={{ padding:'10px 0', borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <div style={{ fontFamily:BODY, fontSize:13, color:TEXT }}>{g.name}</div>
                <Mono size={10} color={MUTED}>F:{g.female} M:{g.male}</Mono>
              </div>
              <div style={{ display:'flex', height:4, gap:1 }}>
                <div style={{ flex:g.female, background:AMBER }}/>
                <div style={{ flex:g.male, background:TEAL }}/>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Label color={TEAL}>Male-Dominant</Label>
          {maleSkewed.map(g=>(
            <div key={g.name} style={{ padding:'10px 0', borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <div style={{ fontFamily:BODY, fontSize:13, color:TEXT }}>{g.name}</div>
                <Mono size={10} color={MUTED}>M:{g.male} F:{g.female}</Mono>
              </div>
              <div style={{ display:'flex', height:4, gap:1 }}>
                <div style={{ flex:g.female, background:AMBER }}/>
                <div style={{ flex:g.male, background:TEAL }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: PROFILES ───────────────────────────────────────────────────────────
function TabProfiles() {
  const m = useMobile();
  const archetypes = [
    { id:'rb', label:'The R&B Purist', count:17, color:AMBER, desc:'All four picks from R&B and Soul. These respondents stayed in their lane entirely — and their lane is the most represented genre in the survey.', examples:[{num:1,age:29,gender:'F',picks:["New Edition","Destiny's Child","The Temptations","Kirk Franklin & Family"]},{num:6,age:35,gender:'F',picks:["New Edition","Destiny's Child","3LW","112"]},{num:25,age:44,gender:'F',picks:["Jodeci","Xscape","Dru Hill","SWV"]}]},
    { id:'hh', label:'The Hip-Hop Head', count:6, color:TEAL, desc:'Four hip-hop picks, no exceptions. A smaller but committed group — and the purest expression of genre loyalty in the dataset.', examples:[{num:43,age:27,gender:'M',picks:["Wu-Tang Clan","G-Unit","ASAP Mob","Three 6 Mafia"]},{num:50,age:30,gender:'M',picks:["OutKast","NWA","Migos","G-Unit"]},{num:54,age:30,gender:'M',picks:["OutKast","Goodie Mob","G-Unit","Young Money"]}]},
    { id:'faithful', label:'The Faithful', count:42, color:'#8B9FE8', desc:'Two genres represented. The majority of the survey. Typically an R&B foundation with one hip-hop or pop pick.', examples:[{num:16,age:30,gender:'M',picks:["Boyz II Men","Destiny's Child","TLC","SWV"]},{num:7,age:50,gender:'F',picks:["Wu-Tang Clan","Boyz II Men","SWV","O'Jays"]},{num:71,age:38,gender:'M',picks:["Three 6 Mafia","Wu-Tang Clan","Cash Money","OutKast"]}]},
    { id:'eclectic', label:'The Eclectic', count:35, color:'#E8875D', desc:'Three or more genres across four picks. These respondents refused to be categorized. Often the most interesting individual lists.', examples:[{num:2,age:33,gender:'M',picks:["The Beatles","Fall Out Boy","OutKast","Earth, Wind & Fire"]},{num:41,age:19,gender:'M',picks:["OutKast","Coldplay","Daft Punk","TLC"]},{num:13,age:40,gender:'M',picks:["Bone Thugs N Harmony","Queen","The Beatles","OutKast"]}]},
    { id:'rock', label:'The Rock Bloc', count:2, color:'#8B9FE8', desc:'Only 2 respondents went all pop/rock. In a survey that skews heavily toward Black music, the clearest outliers in the dataset.', examples:[{num:73,age:21,gender:'M',picks:["Imagine Dragons","Twenty One Pilots","She Wants Revenge","Poor Mans Poison"]},{num:90,age:33,gender:'F',picks:["Fall Out Boy","Fleetwood Mac","NSYNC","Daft Punk"]}]},
  ];
  const pad = m ? '20px 16px' : '36px 48px';
  return (
    <div style={{ padding:pad }}>
      <SectionDivider label="Respondent Archetypes by Genre Composition"/>
      <div style={{ display:'flex', height:10, borderRadius:3, overflow:'hidden', marginBottom:28, gap:2 }}>
        {archetypes.map(a=><div key={a.id} style={{ flex:a.count, background:a.color, opacity:0.85 }}/>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:m?'1fr':'1fr 1fr', gap:16 }}>
        {archetypes.map(a=>(
          <Card key={a.id} style={{ borderLeft:`3px solid ${a.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div style={{ fontFamily:COND, fontSize:m?18:22, fontWeight:700, color:a.color }}>{a.label}</div>
              <div style={{ fontFamily:COND, fontSize:32, fontWeight:900, color:a.color, lineHeight:1 }}>{a.count}</div>
            </div>
            <div style={{ fontFamily:BODY, fontSize:13, color:MUTED, lineHeight:1.6, marginBottom:14 }}>{a.desc}</div>
            <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:12 }}>
              <Label color={DIM}>Example Lists</Label>
              {a.examples.map(ex=>(
                <div key={ex.num} style={{ marginBottom:10 }}>
                  <div style={{ fontFamily:MONO, fontSize:10, color:DIM, marginBottom:4 }}>#{ex.num} · {ex.gender==='F'?'Female':'Male'} · Age {ex.age}</div>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                    {ex.picks.map(p=>(
                      <span key={p} style={{ fontFamily:BODY, fontSize:11, color:TEXT, background:SURF2, border:`1px solid ${BORDER}`, borderRadius:2, padding:'2px 7px' }}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: ALL RESPONSES ──────────────────────────────────────────────────────
function TabResponses() {
  const m = useMobile();
  const winner = RESPONDENTS[0];
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('score');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (col) => {
    if (sortCol===col) setSortDir(d=>d==='asc'?'desc':'asc');
    else { setSortCol(col); setSortDir(col==='gender'?'asc':'desc'); }
  };

  const sorted = useMemo(()=>{
    const base = search.trim()
      ? RESPONDENTS.filter(r=>r.picks.some(p=>p.toLowerCase().includes(search.toLowerCase()))||r.gender.toLowerCase().includes(search.toLowerCase()))
      : [...RESPONDENTS];
    return base.sort((a,b)=>{
      let av=a[sortCol],bv=b[sortCol];
      if(sortCol==='gender'){av=av[0];bv=bv[0];}
      if(typeof av==='string') return sortDir==='asc'?av.localeCompare(bv):bv.localeCompare(av);
      return sortDir==='asc'?av-bv:bv-av;
    });
  },[search,sortCol,sortDir]);

  const ColHead = ({ col, label, align='left' }) => {
    const active = sortCol===col;
    return (
      <div onClick={()=>handleSort(col)} style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:active?AMBER:DIM, cursor:'pointer', userSelect:'none', textAlign:align }}>
        {label}{active?(sortDir==='asc'?' ↑':' ↓'):''}
      </div>
    );
  };

  const pad = m ? '20px 16px' : '36px 48px';
  const cols = m ? '36px 36px 1fr 44px' : '50px 80px 60px 1fr 80px';

  return (
    <div style={{ padding:pad }}>
      {/* Winner */}
      <div style={{ border:`1px solid ${AMBER}`, background:'rgba(245,196,48,0.04)', borderRadius:3, padding:m?'16px 16px':'24px 28px', marginBottom:24 }}>
        <div style={{ fontFamily:MONO, fontSize:10, color:AMBER, letterSpacing:'0.18em', marginBottom:12 }}>
          // Most Popular List · #{winner.num}
        </div>
        <div style={{ display:'flex', alignItems:m?'flex-start':'flex-end', gap:20, flexDirection:m?'column':'row' }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, color:MUTED, marginBottom:8 }}>{winner.gender} · Age {winner.age}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {winner.picks.map(p=>(
                <div key={p} style={{ fontFamily:BODY, fontSize:m?12:14, fontWeight:500, color:TEXT, background:SURF, border:`1px solid ${BORDER}`, borderRadius:2, padding:'5px 12px' }}>{p}</div>
              ))}
            </div>
          </div>
          <div style={{ textAlign:m?'left':'right', flexShrink:0 }}>
            <div style={{ fontFamily:MONO, fontSize:10, color:MUTED, marginBottom:2 }}>Score</div>
            <div style={{ fontFamily:COND, fontSize:m?40:56, fontWeight:900, color:AMBER, lineHeight:1 }}>{winner.score}</div>
            <div style={{ fontFamily:MONO, fontSize:10, color:MUTED }}>Sum of appearances</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by group or gender..."
          style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:3, padding:'8px 12px', fontFamily:BODY, fontSize:13, color:TEXT, outline:'none', width:m?'100%':260 }}/>
        <div style={{ fontFamily:MONO, fontSize:10, color:DIM }}>{sorted.length} of {RESPONDENTS.length}</div>
        {!m&&<div style={{ fontFamily:MONO, fontSize:10, color:DIM, marginLeft:'auto' }}>Click headers to sort</div>}
      </div>

      {/* Table */}
      <div style={{ display:'grid', gridTemplateColumns:cols, gap:10, padding:'0 12px 8px', borderBottom:`1px solid ${BORDER}` }}>
        <ColHead col="num" label="#"/>
        <ColHead col="gender" label={m?'G':'Gender'}/>
        {!m&&<ColHead col="age" label="Age"/>}
        <div style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:DIM }}>Picks</div>
        <ColHead col="score" label="Score" align="right"/>
      </div>

      {sorted.map((r,i)=>{
        const isWinner = r.num===winner.num;
        return (
          <div key={r.num} style={{ display:'grid', gridTemplateColumns:cols, gap:10, padding:'10px 12px', borderBottom:`1px solid ${BORDER}`, background:isWinner?'rgba(245,196,48,0.03)':i%2===0?'transparent':'rgba(255,255,255,0.01)', alignItems:'center' }}>
            <Mono color={isWinner?AMBER:DIM} size={m?10:11}>{r.num}</Mono>
            <Mono color={r.gender==='Female'?AMBER:TEAL} size={m?10:11}>{r.gender[0]}</Mono>
            {!m&&<Mono color={MUTED}>{r.age}</Mono>}
            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
              {m
                ? <span style={{ fontFamily:BODY, fontSize:11, color:TEXT }}>{r.picks.join(', ')}</span>
                : r.picks.map(p=>(
                    <span key={p} style={{ fontFamily:BODY, fontSize:11, color:TEXT, background:SURF2, borderRadius:2, padding:'2px 6px', border:`1px solid ${BORDER}` }}>{p}</span>
                  ))
              }
            </div>
            <div style={{ fontFamily:COND, fontSize:m?16:18, fontWeight:700, color:isWinner?AMBER:sortCol==='score'&&i<5?AMBER+'70':MUTED, textAlign:'right' }}>{r.score}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
const TABS = [
  { id:'overview', label:'Overview', short:'Overview', component:TabOverview },
  { id:'groups',   label:'The Groups', short:'Groups',  component:TabGroups },
  { id:'genre',    label:'Genre',      short:'Genre',   component:TabGenre },
  { id:'age',      label:'Age',        short:'Age',     component:TabAge },
  { id:'gender',   label:'Gender',     short:'Gender',  component:TabGender },
  { id:'profiles', label:'Profiles',   short:'Profiles',component:TabProfiles },
  { id:'responses',label:'All Responses',short:'Responses',component:TabResponses },
];

export default function App() {
  const [tab, setTab] = useState('overview');
  const isMobile = useIsMobile();
  const Active = TABS.find(t=>t.id===tab).component;
  const hPad = isMobile ? '20px 16px 16px' : '44px 48px 28px';
  const navPad = isMobile ? '0 8px' : '0 48px';

  return (
    <MobileCtx.Provider value={isMobile}>
      <div style={{ minHeight:'100vh', background:BG, color:TEXT, fontFamily:BODY }}>
        {/* Header */}
        <div style={{ padding:hPad, borderBottom:`1px solid ${BORDER}`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,196,48,0.06) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:isMobile?14:18 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:TEAL, boxShadow:`0 0 8px ${TEAL}`, animation:'pulse 2s infinite' }}/>
            <span style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:TEAL }}>
              Survey Says · Vol. III
            </span>
          </div>
          <div style={{ fontFamily:COND, fontSize:isMobile?38:68, fontWeight:900, lineHeight:0.9, textTransform:'uppercase', color:'#E4F2FF', maxWidth:700, marginBottom:12 }}>
            Greatest<br/><span style={{ color:AMBER }}>Music Groups</span><br/>of All Time
          </div>
          {!isMobile && (
            <div style={{ fontFamily:BODY, fontSize:14, fontWeight:300, color:MUTED, marginBottom:16 }}>
              102 respondents. 4 picks each. Every genre on the table.
            </div>
          )}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:isMobile?0:8 }}>
            {[['102','Respondents'],['126','Groups'],['31','Avg. Age'],['5','Genres']].map(([v,l])=>(
              <div key={l} style={{ padding:'4px 12px', border:`1px solid ${BORDER2}`, borderRadius:2, fontFamily:MONO, fontSize:isMobile?9:10, letterSpacing:'0.1em', color:MUTED }}>
                <span style={{ color:TEXT }}>{v}</span> {l}
              </div>
            ))}
          </div>
          {!isMobile && (
            <div style={{ marginTop:12, fontFamily:MONO, fontSize:10, color:DIM }}>By Aalaiyah Ticer & Kyle Hinson</div>
          )}
        </div>

        {/* Nav */}
        <div style={{ display:'flex', background:'#0C1828', borderBottom:`1px solid ${BORDER}`, padding:navPad, overflowX:'auto' }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:isMobile?'11px 10px':'13px 18px',
              fontFamily:MONO, fontSize:isMobile?9:10, letterSpacing:isMobile?'0.06em':'0.12em', textTransform:'uppercase',
              color:tab===t.id?AMBER:MUTED, background:'transparent', border:'none',
              borderBottom:`2px solid ${tab===t.id?AMBER:'transparent'}`,
              marginBottom:-1, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0,
              transition:'all 0.15s',
            }}>
              {isMobile ? t.short : t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <Active/>

        {isMobile && (
          <div style={{ padding:'16px', textAlign:'center', fontFamily:MONO, fontSize:9, color:DIM, borderTop:`1px solid ${BORDER}` }}>
            By Aalaiyah Ticer & Kyle Hinson
          </div>
        )}
      </div>
    </MobileCtx.Provider>
  );
}
