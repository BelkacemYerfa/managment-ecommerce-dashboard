import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "pma",
  password: "",
  database: "storeBuilder",
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    const res = {
      id: crypto.randomUUID(),
      name: name,
      userId: userId,
    };

    /*  connection.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
      const sqlStatement = `
          INSERT INTO Store (id, name, userId)
          VALUES (UUID(), '${name}', '${userId}');
        `;
      connection.query(sqlStatement, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        console.log(result);
      });
    }); */
    console.log("[STORES_POST]", store);
    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
