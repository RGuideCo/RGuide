import { User } from "@/types";

const rGuideAvatar =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#0f766e" />
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="white">R</text>
    </svg>
  `);

export const users: User[] = [
  {
    id: "user-rguide-food",
    name: "R Food",
    joinedAt: "2021-01-01T00:00:00.000Z",
    avatar: rGuideAvatar,
    bio: "R Guide editorial desk for restaurant picks, cafes, bakeries, and memorable meals.",
  },
  {
    id: "user-rguide-nightlife",
    name: "R Nightlife",
    joinedAt: "2021-01-01T00:00:00.000Z",
    avatar: rGuideAvatar,
    bio: "R Guide editorial desk for bars, clubs, rooftops, and after-dark routes.",
  },
  {
    id: "user-rguide-culture",
    name: "R Culture",
    joinedAt: "2021-01-01T00:00:00.000Z",
    avatar: rGuideAvatar,
    bio: "R Guide editorial desk for museums, architecture, galleries, and cultural stops.",
  },
  {
    id: "user-rguide-stay",
    name: "R Stay",
    joinedAt: "2021-01-01T00:00:00.000Z",
    avatar: rGuideAvatar,
    bio: "R Guide editorial desk for neighborhoods to stay in, hotels, and design-led lodging picks.",
  },
  {
    id: "user-rguide-nature",
    name: "R Nature",
    joinedAt: "2021-01-01T00:00:00.000Z",
    avatar: rGuideAvatar,
    bio: "R Guide editorial desk for parks, lookouts, coastlines, and outdoor escapes.",
  },
  {
    id: "user-rguide-activities",
    name: "R Activities",
    joinedAt: "2021-01-01T00:00:00.000Z",
    avatar: rGuideAvatar,
    bio: "R Guide editorial desk for top activities, landmarks, and must-do experiences.",
  },
  {
    id: "user-rguide-history",
    name: "R History",
    joinedAt: "2021-01-01T00:00:00.000Z",
    avatar: rGuideAvatar,
    bio: "R Guide editorial desk for historical journeys, mapped routes, timelines, and place-based story layers.",
  },
  {
    id: "user-gabriel-soyka",
    name: "Gabriel Soyka",
    email: "gabriel.m.soyka@gmail.com",
    joinedAt: "2026-01-10T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/160?img=59",
    bio: "Collecting practical neighborhood guides and journey notes from places I visit.",
  },
  {
    id: "user-brodriguezdesign",
    name: "Brian Rodriguez",
    email: "brodriguezdesign@gmail.com",
    joinedAt: "2026-01-10T00:00:00.000Z",
    avatar: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=400&q=80",
    bio: "Design-led city explorer building map guides and place-based experiences.",
  },
];
