import mongoose from "mongoose";
import "../config/db.config.js";
import { faker } from "@faker-js/faker";

import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Review from "../models/review.model.js";
import Message from "../models/message.model.js";

const PROMOTIONS = ["01.2024", "02.2024", "03.2024", "01.2025", "02.2025"];
const STUDENTS_PER_PROMOTION = 10;
const PASSWORD = "123123";

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Ruby",
  "Go",
  "Rust",
  "C#",
  "PHP",
  "Swift",
];

const CITIES = [
  "Madrid",
  "Barcelona",
  "Lisboa",
  "Miami",
  "México DF",
  "São Paulo",
  "Berlín",
  "Ámsterdam",
  "París",
  "Remote",
];

const PROJECT_TITLES = {
  1: [
    "Memory Game",
    "Snake Game",
    "Trivia Quiz",
    "Tic Tac Toe",
    "Whack-a-Mole",
    "Space Invaders",
    "Hangman",
    "Simon Says",
    "Breakout Clone",
    "Pong Classic",
  ],
  2: [
    "Recipe Manager",
    "Task Tracker",
    "Job Board",
    "Blog Platform",
    "Expense Tracker",
    "Inventory System",
    "Booking App",
    "Survey Builder",
    "Wiki Engine",
    "Event Planner",
  ],
  3: [
    "Crypto Dashboard",
    "Movie Watchlist",
    "Habit Tracker",
    "Chat App",
    "Fitness Logger",
    "Music Explorer",
    "Weather Station",
    "Recipe Finder",
    "Travel Planner",
    "Portfolio Builder",
  ],
};

const PROJECT_DESCRIPTIONS = {
  1: "A fun browser game built with vanilla HTML, CSS, and JavaScript. Features DOM manipulation, event handling, and responsive design.",
  2: "A full-stack web application built with Express.js, Node.js, and MongoDB. Includes CRUD operations, user authentication, and server-side rendering with Handlebars.",
  3: "A modern single-page application built with React. Features client-side routing, state management, API integration, and a polished UI.",
};

const REVIEW_COMMENTS = [
  "Great project! Really clean code and well-structured.",
  "Nice work! The UI looks amazing. Could use more error handling though.",
  "Impressive for this module level. Keep it up!",
  "Solid implementation. I love the attention to detail.",
  "Good project overall. The functionality works well.",
  "Really creative approach! Learned something new looking at your code.",
  "Well done! The design is very intuitive and user-friendly.",
  "Interesting project idea. The execution could be improved a bit.",
  "Awesome work! One of the best projects in our promotion.",
  "Clean and functional. Would love to see more features added.",
];

const MESSAGE_SUBJECTS = [
  "Hey! Love your project",
  "Question about your code",
  "Want to collaborate?",
  "Great work on Module project!",
  "Need help with something",
  "Feedback on your project",
  "Let's connect!",
  "Study group this weekend?",
  "Job opportunity I found",
  "Tips for the next module",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

async function seed() {
  // Wait for DB connection
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) =>
      mongoose.connection.once("connected", resolve),
    );
  }

  // Drop database
  await mongoose.connection.dropDatabase();
  console.log("[OK] Database dropped");

  // --- Create Users ---
  const users = [];
  for (const promotion of PROMOTIONS) {
    for (let i = 0; i < STUDENTS_PER_PROMOTION; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet
        .username({ firstName, lastName })
        .toLowerCase();

      const user = await User.create({
        email: `${username}@ironhack.edu`,
        password: PASSWORD,
        name: `${firstName} ${lastName}`,
        bio: faker.lorem.sentence({ min: 8, max: 20 }),
        githubUrl: `https://github.com/${username}`,
        linkedinUrl: `https://linkedin.com/in/${username}`,
        location: pickRandom(CITIES),
        languages: pickRandomN(LANGUAGES, faker.number.int({ min: 1, max: 4 })),
        avatarUrl: faker.image.avatar(),
        promotion,
      });

      users.push(user);
    }
  }
  console.log(`[OK] ${users.length} users created`);

  // --- Create Projects ---
  const projects = [];
  for (const user of users) {
    for (const module of [1, 2, 3]) {
      const title = pickRandom(PROJECT_TITLES[module]);
      const username = user.email.split("@")[0];

      const project = await Project.create({
        title,
        description: PROJECT_DESCRIPTIONS[module],
        module,
        githubRepo: `https://github.com/${username}/${faker.helpers.slugify(title).toLowerCase()}`,
        liveUrl: faker.internet.url(),
        images: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => faker.image.urlPicsumPhotos(),
        ),
        author: user._id,
        promotion: user.promotion,
      });

      projects.push(project);
    }
  }
  console.log(`[OK] ${projects.length} projects created`);

  // --- Create Reviews ---
  const reviews = [];
  for (const project of projects) {
    const numReviews = faker.number.int({ min: 0, max: 5 });
    const otherUsers = users.filter((u) => !u._id.equals(project.author));
    const reviewers = pickRandomN(otherUsers, numReviews);

    for (const reviewer of reviewers) {
      const review = await Review.create({
        comment: pickRandom(REVIEW_COMMENTS),
        rating: faker.number.int({ min: 1, max: 5 }),
        author: reviewer._id,
        project: project._id,
      });
      reviews.push(review);
    }
  }
  console.log(`[OK] ${reviews.length} reviews created`);

  // --- Create Messages ---
  const messagesData = [];
  for (let i = 0; i < 100; i++) {
    const sender = pickRandom(users);
    let receiver = pickRandom(users);
    while (receiver._id.equals(sender._id)) {
      receiver = pickRandom(users);
    }

    messagesData.push({
      sender: sender._id,
      receiver: receiver._id,
      subject: pickRandom(MESSAGE_SUBJECTS),
      body: faker.lorem.paragraph({ min: 1, max: 3 }),
      read: faker.datatype.boolean(),
    });
  }
  const messages = await Message.insertMany(messagesData);
  console.log(`[OK] ${messages.length} messages created`);

  // Close connection
  await mongoose.connection.close();
  console.log("[OK] Connection closed. Seed complete!");
}

seed().catch((error) => {
  console.error("[ERROR]", error);
  mongoose.connection.close();
  process.exit(1);
});
