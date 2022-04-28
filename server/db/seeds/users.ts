import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { 
            userId: 1,
            firstName: "Anakin",
            lastName: "Skywalker",
            email: "AniSky@walker.com",
            passwordHash: "$2b$10$fJXbx3HB1VPHm9IZJ9f63O.HCPlkwLvG39LHcMgQ1x9sEfVjZ.BL2",
        },
    
    ]);
}
