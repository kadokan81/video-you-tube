import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';

import styles from '../styles/Home.module.css';

import Banner from '../components/banner/banner';
import Navbar from '../components/navbar/navbar';
import SectionCards, { VideoTypes } from '../components/card/section-cards';
import { getVideos, getVideosBiId } from '../lib/videos';

import { StatsHasuraDataArray, getWatchedVideos } from '../lib/hasura';

import { verifyToken } from '../lib/utils';

// ];
// This gets called on every request
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const token = context.req.cookies.token || '';

	const userId = (await verifyToken(token)) as string;

	// if (!userId) {
	// 	return {
	// 		props: {},
	// 		redirect: {
	// 			destination: '/login',
	// 			permanent: false,
	// 		},
	// 	};
	// }
	const videosDisney = await getVideos('disney trailer');
	const travelVideos = await getVideos('travel');
	const reactVideos = await getVideos('react.js  ');

	const watchedVideosIds = await getWatchedVideos(userId, token);

	const youTubeVideoFromWatched = (watchedVideosIds: StatsHasuraDataArray) => {
		try {
			const promises = watchedVideosIds.map(async (v) => {
				const res = await getVideosBiId(v.videoId);
				return {
					...res,
				};
			});
			return Promise.all(promises);
		} catch (error) {
			console.log(
				'🚀 ~ file: index.tsx:48 ~ youTubeVideoFromWatched ~ error:',
				error
			);
		}
	};
	const watchedVideoFromYouTube = await youTubeVideoFromWatched(
		watchedVideosIds
	);

	return {
		props: { videosDisney, travelVideos, reactVideos, watchedVideoFromYouTube },
	};
}

type HomePageProps = {
	videosDisney: VideoTypes[];
	travelVideos: VideoTypes[];
	reactVideos: VideoTypes[];
	watchedVideoFromYouTube: VideoTypes[];
};

const Home: NextPage<HomePageProps> = ({
	videosDisney,
	travelVideos,
	reactVideos,
	watchedVideoFromYouTube,
}) => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta name='description' content='Generated by create next app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Navbar />
			<Banner
				title='Clifford the red dog'
				subTitle='a very cute dog'
				imgUrl='/static/clifford.webp'
				videoId='4zH5iYM4wJo'
			/>
			{watchedVideoFromYouTube && (
				<SectionCards
					videos={watchedVideoFromYouTube}
					title='Watch videos'
					size='large'
					shouldScale={true}
					shouldWrap={false}
				/>
			)}
			{videosDisney && (
				<SectionCards
					videos={videosDisney}
					title='Disney List'
					size='large'
					shouldScale={true}
					shouldWrap={false}
				/>
			)}
			{travelVideos && (
				<SectionCards
					videos={travelVideos}
					title='Travel'
					size='medium'
					shouldScale={true}
					shouldWrap={false}
				/>
			)}

			<footer className={styles.footer}></footer>
		</div>
	);
};

export default Home;

// type youTube = {
// 	"kind": "youtube#searchResult",
// 	"etag": etag,
// 	"id": {
// 	  "kind": string,
// 	  "videoId": string,
// 	  "channelId": string,
// 	  "playlistId": string
// // 	},
// 	"snippet": {
// 	  "publishedAt": datetime,
// 	  "channelId": string,
// 	  "title": string,
// 	  "description": string,
// 	  "thumbnails": {
// 		(key): {
// 		  "url": string,
// 		  "width": unsigned integer,
// 		  "height": unsigned integer
// 		}
// 	  },
// 	  "channelTitle": string,
// 	  "liveBroadcastContent": string
// 	}
//   }
