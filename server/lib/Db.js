const Influx = require('influx');

let influx;

function connect() {
    if (!influx) {
        influx = new Influx.InfluxDB({
            host: process.env.DB_HOST,
            database: process.env.DB_NAME_DB,
            schema: [
                {
                    measurement: 'sprinkle_duration',
                    fields: {
                        zoneId: Influx.FieldType.STRING,
                        durationMs: Influx.FieldType.INTEGER,
                        onEpochMs: Influx.FieldType.INTEGER,
                        offEpochMs: Influx.FieldType.INTEGER,
                    },
                    tags: [
                        'dumbHomeSystemId',
                        'zoneIdTag'
                    ]
                }
            ]
        });
    }
}

/**
 * 
 * @param {string} zoneId
 * @param {int} durationMs
 */
function writePoint(zoneId, durationMs, onEpochMs, offEpochMs) {
    if (!influx) {
        try {
            connect();
        } catch (e) {
            // TODO log
            return;
        }
    }
    return influx.writePoints([
        {
            measurement: 'sprinkle_duration',
            tags: {
                dumbHomeSystemId: 'martins-sprinklers',
                zoneIdTag: zoneId,
            },
            fields: {
                durationMs,
                zoneId,
                onEpochMs,
                offEpochMs,
            },
        }
    ]);
    // .then(() => {
    //     return influx.query(`
    //     select * from response_times
    //     where host = ${Influx.escape.stringLit(os.hostname())}
    //     order by time desc
    //     limit 10
    //   `)
    // })
    // .then(rows => {
    //     rows.forEach(row => console.log(`A request to ${row.path} took ${row.duration}ms`))
    // })
}

module.exports = {
    writePoint,
}
