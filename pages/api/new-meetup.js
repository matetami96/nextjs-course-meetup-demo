import { MongoClient } from "mongodb";

// /api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
	if (req.method === "POST") {
		const data = req.body;
		console.log("data: ", data);

		try {
			const client = await MongoClient.connect(
				"mongodb+srv://matetami:Tamiwarrior0913@cluster0.ythrc.mongodb.net/meetups?retryWrites=true&w=majority"
			);
			const db = client.db();

			const meetupsCollection = db.collection("meetups");

			const result = await meetupsCollection.insertOne(data);

			console.log("result", result);

			client.close();

			res.status(201).json({ message: "Meetup inserted!" });
		} catch (error) {
			console.log("Error during request: ", error);
		}
	}
}

export default handler;
