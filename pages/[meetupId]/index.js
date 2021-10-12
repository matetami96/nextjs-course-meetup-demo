import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
	return (
		<>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name="description" content={props.meetupData.description} />
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</>
	);
}

export async function getStaticPaths() {
	let meetups;

	try {
		const client = await MongoClient.connect(
			"mongodb+srv://matetami:Tamiwarrior0913@cluster0.ythrc.mongodb.net/meetups?retryWrites=true&w=majority"
		);
		const db = client.db();

		const meetupsCollection = db.collection("meetups");

		meetups = await meetupsCollection
			.find(
				{},
				{
					_id: 1,
				}
			)
			.toArray();

		client.close();
	} catch (error) {
		console.log("Error getting meetups data:", error);
	}

	return {
		fallback: "blocking",
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() },
		})),
	};
}

export async function getStaticProps(context) {
	// fetch data for a single meetup
	const meetupId = context.params.meetupId;

	let selectedMeetup;

	try {
		const client = await MongoClient.connect(
			"mongodb+srv://matetami:Tamiwarrior0913@cluster0.ythrc.mongodb.net/meetups?retryWrites=true&w=majority"
		);
		const db = client.db();

		const meetupsCollection = db.collection("meetups");

		selectedMeetup = await meetupsCollection.findOne({
			_id: ObjectId(meetupId),
		});

		client.close();
	} catch (error) {
		console.log("Error getting meetups data:", error);
	}

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupDetails;
