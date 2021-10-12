import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
	return (
		<>
			<Head>
				<title>React Meetups</title>
				<meta
					name="description"
					content="Browse a huge list of highly active React meetups!"
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</>
	);
}

// use this when data changes every second + you need the request/response objects
/* export async function getServerSideProps(context) {
	const req = context.req;
	const res = context.res;

	// fetch data from an API code runs on the server
	return {
		props: {
			meetups: DUMMY_MEETUPS,
		},
	};
} */

export async function getStaticProps() {
	// fetch data from an API during the build process so not on the server not on the client
	let meetups;

	try {
		const client = await MongoClient.connect(
			"mongodb+srv://matetami:Tamiwarrior0913@cluster0.ythrc.mongodb.net/meetups?retryWrites=true&w=majority"
		);
		const db = client.db();

		const meetupsCollection = db.collection("meetups");

		meetups = await meetupsCollection.find().toArray();

		client.close();
	} catch (error) {
		console.log("Error getting meetups data:", error);
	}

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		// incremental static generation
		revalidate: 1,
	};
}

export default HomePage;
