const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Sighting = require("./server/models/Sighting");
const Incident = require("./server/models/Incident");

const sightings = [
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Snakes",
    location: "Block A Parking Lot",
    campus: "Pretoria Campus",
    notes: "Large brown snake spotted near the entrance, students advised to keep distance",
    status: "Open"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Bees",
    location: "Library Garden",
    campus: "Stellenbosch Campus",
    notes: "Swarm of bees near the outdoor benches, area cordoned off",
    status: "Pending"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Lizards",
    location: "Block C Rooftop",
    campus: "Kempton Park Campus",
    notes: "Large monitor lizard spotted on the rooftop, not aggressive",
    status: "Reviewed"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Snakes",
    location: "Sports Field",
    campus: "Pretoria Campus",
    notes: "Puff adder spotted near the goalpost during morning practice",
    status: "Resolved",
    prediction: { label: "venomous", confidence: "91.3%" }
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Bees",
    location: "Cafeteria Entrance",
    campus: "Stellenbosch Campus",
    notes: "Beehive discovered above the main cafeteria door",
    status: "Open"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Snakes",
    location: "Block B Stairwell",
    campus: "Kempton Park Campus",
    notes: "Small green snake found on stairwell, non-aggressive behaviour observed",
    status: "Pending",
    prediction: { label: "Nonvenomous", confidence: "78.5%" }
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Lizards",
    location: "Main Entrance",
    campus: "Pretoria Campus",
    notes: "Blue-headed agama lizard on the wall near reception",
    status: "Open"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Snakes",
    location: "IT Lab Corridor",
    campus: "Stellenbosch Campus",
    notes: "Snake skin found in corridor, snake not visible but may still be in building",
    status: "Reviewed",
    prediction: { label: "Nonvenomous", confidence: "65.0%" }
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Spiders",
    location: "Student Bathrooms Block D",
    campus: "Kempton Park Campus",
    notes: "Large rain spider found in student bathroom, students panicking",
    status: "Open"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Bees",
    location: "Soccer Field Pavilion",
    campus: "Pretoria Campus",
    notes: "Beehive under the pavilion roof, students unable to use seating area",
    status: "Pending"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Snakes",
    location: "Parking Lot B",
    campus: "Stellenbosch Campus",
    notes: "Cape cobra spotted between parked cars, area evacuated",
    status: "Resolved",
    prediction: { label: "venomous", confidence: "95.1%" }
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    species: "Other",
    location: "Admin Block Garden",
    campus: "Kempton Park Campus",
    notes: "Mongoose spotted near the admin building, chasing smaller animals",
    status: "Reviewed"
  }
];

const incidents = [
  {
    reporter: new mongoose.Types.ObjectId(),
    urgency: "High",
    situationDescription: "Student bitten by unknown snake near Block A. Immediate medical attention required. Snake disappeared into drain.",
    campus: "Pretoria Campus",
    buildingArea: "Block A",
    peopleAtRisk: 5,
    status: "Resolved",
    adminNotes: "Student treated at campus clinic, snake removal team contacted"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    urgency: "Medium",
    situationDescription: "Bee swarm blocking cafeteria entrance, approximately 30 students unable to enter safely.",
    campus: "Stellenbosch Campus",
    buildingArea: "Cafeteria",
    peopleAtRisk: 30,
    status: "In Progress",
    adminNotes: "Pest control scheduled for this afternoon"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    urgency: "Low",
    situationDescription: "Large lizard entered the computer lab through an open window causing panic among students.",
    campus: "Kempton Park Campus",
    buildingArea: "IT Lab",
    peopleAtRisk: 12,
    status: "Open"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    urgency: "High",
    situationDescription: "Cobra spotted in the student bathroom, entire block evacuated. Snake is cornered behind toilet.",
    campus: "Pretoria Campus",
    buildingArea: "Block C Bathrooms",
    peopleAtRisk: 8,
    status: "Resolved",
    adminNotes: "Snake safely relocated by licensed pest control"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    urgency: "Medium",
    situationDescription: "Wasp nest discovered in parking lot roof structure above student vehicles.",
    campus: "Stellenbosch Campus",
    buildingArea: "Parking Lot",
    peopleAtRisk: 20,
    status: "In Progress"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    urgency: "High",
    situationDescription: "Student allergic to bees stung twice near the library. EpiPen administered, ambulance called.",
    campus: "Kempton Park Campus",
    buildingArea: "Library",
    peopleAtRisk: 1,
    status: "Resolved",
    adminNotes: "Student transported to hospital, recovering well"
  },
  {
    reporter: new mongoose.Types.ObjectId(),
    urgency: "Low",
    situationDescription: "Puff adder spotted near the sports field during lunch break. Students kept away from the area.",
    campus: "Pretoria Campus",
    buildingArea: "Sports Field",
    peopleAtRisk: 15,
    status: "Open"
  }
];

async function populate() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000
});

    await Sighting.deleteMany();
    await Incident.deleteMany();
    console.log("Cleared existing data");

    await Sighting.insertMany(sightings);
    console.log(`Inserted ${sightings.length} sightings`);

    await Incident.insertMany(incidents);
    console.log(`Inserted ${incidents.length} incidents`);

    console.log("Database populated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Population failed:", err.message);
    process.exit(1);
  }
}

populate();
