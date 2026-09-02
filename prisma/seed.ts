import { PrismaClient } from "@prisma/client";
import { CITY_LIST } from "../src/lib/college-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Supabase PostgreSQL Seeding...");

  for (const city of CITY_LIST) {
    console.log(`📍 Processing City: ${city.name} (${city.id})`);

    const cityLat = city.hub.position.lat;
    const cityLng = city.hub.position.lng;

    // 1. City
    await prisma.city.upsert({
      where: { id: city.id },
      update: {
        name: city.name,
        lat: cityLat,
        lng: cityLng,
        hubName: city.hub.name,
        hubLat: cityLat,
        hubLng: cityLng,
      },
      create: {
        id: city.id,
        name: city.name,
        lat: cityLat,
        lng: cityLng,
        hubName: city.hub.name,
        hubLat: cityLat,
        hubLng: cityLng,
      },
    });

    // 2. Railways & Bus Stops (Transits)
    const allTransits = [
      ...(city.railways || []).map((r) => ({ ...r, type: "railway" })),
      ...(city.busStops || []).map((b) => ({ ...b, type: "bus" })),
    ];

    for (const t of allTransits) {
      await prisma.transit.upsert({
        where: { id: t.id },
        update: {
          name: t.name,
          type: t.type,
          lat: t.position.lat,
          lng: t.position.lng,
          cityId: city.id,
        },
        create: {
          id: t.id,
          name: t.name,
          type: t.type,
          lat: t.position.lat,
          lng: t.position.lng,
          cityId: city.id,
        },
      });
    }

    // 3. Landmarks
    if (city.landmarks) {
      for (const lm of city.landmarks) {
        await prisma.landmark.upsert({
          where: { id: lm.id },
          update: {
            name: lm.name,
            lat: lm.position.lat,
            lng: lm.position.lng,
            cityId: city.id,
          },
          create: {
            id: lm.id,
            name: lm.name,
            lat: lm.position.lat,
            lng: lm.position.lng,
            cityId: city.id,
          },
        });
      }
    }

    // 4. Colleges & Courses
    for (const c of city.colleges) {
      await prisma.college.upsert({
        where: { id: c.id },
        update: {
          name: c.name,
          shortName: c.shortName,
          instituteCode: c.instituteCode || null,
          status: c.status || null,
          autonomy: c.autonomy || null,
          university: c.university || null,
          address: c.address || null,
          district: c.district || null,
          lat: c.position ? c.position.lat : null,
          lng: c.position ? c.position.lng : null,
          website: c.website || null,
          cityId: city.id,
        },
        create: {
          id: c.id,
          name: c.name,
          shortName: c.shortName,
          instituteCode: c.instituteCode || null,
          status: c.status || null,
          autonomy: c.autonomy || null,
          university: c.university || null,
          address: c.address || null,
          district: c.district || null,
          lat: c.position ? c.position.lat : null,
          lng: c.position ? c.position.lng : null,
          website: c.website || null,
          cityId: city.id,
        },
      });

      // Insert courses with cutoffs JSON
      if (c.courses && c.courses.length > 0) {
        await prisma.course.deleteMany({ where: { collegeId: c.id } });
        for (const crs of c.courses) {
          await prisma.course.create({
            data: {
              choiceCode: crs.choiceCode,
              name: crs.name,
              branch: crs.branch || null,
              intake: crs.intake || null,
              cutoffsJson: crs.cutoffs ? JSON.stringify(crs.cutoffs) : null,
              collegeId: c.id,
            },
          });
        }
      }
    }
  }

  console.log("🎉 Successfully populated all Maharashtra colleges & cutoffs into Supabase PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
