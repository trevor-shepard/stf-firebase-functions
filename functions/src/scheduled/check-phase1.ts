import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
const moment = require('moment');
import {Season} from '../types'
try {
	admin.initializeApp(functions.config().firebase);
} catch (e) {}




const checkPhase1 = functions.pubsub.schedule('0 0 * * *')
    .timeZone('America/New_York')
    .onRun(async context => {
        const seasons: Season[] = await getPhase1ToUpdate()

        await Promise.all(seasons.map( async season => await updateSeasonPhase(season) ))

    })

const getPhase1ToUpdate = async () => {
    const now = moment().toDate()

    return await admin
        .firestore()
        .collection('seasons')
        .where('phase', '==', 1)
        .where('seasonStart', '<', now)
        .get()
        .then(querySnapshot => {
			const values: any[] = [];
			querySnapshot.forEach(doc => {
                
				values.push(doc.data());
			});
			console.log(
				'Number of incomplete inspections overdue by one day: ',
				values.length
			);
			return values;
        });
}


const updateSeasonPhase = async (season: any) => {
    try {
        await admin
            .firestore()
            .collection('seasons')
            .doc(season.id)
            .update({
                phase: 2
            })
        console.log(`update phase to 2 - ${season.id}`)
    } catch (error) {
        console.log(`failed to update the season phase to 2- ${season.id}`, error)
    }
}

export default checkPhase1