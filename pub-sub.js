const redis = require('redis')

const client = redis.createClient({
    host : 'localhost',
    port : 6379
})

client.on("error" , (error)=>{
    console.log('Error while connecting to Redis!', error)
})

async function testAdditionalFeatures(){
    try {
        await client.connect()
        console.log("Redis Connected!")

        const subscriber = client.duplicate() // Create a new client -> shares the same connection
        await subscriber.connect()

        await subscriber.subscribe("dummy-channel", (message , channel)=>{
            // console.log(`Received a message from ${channel} : ${message}`)
        })

        // Publish message to a dummy channel
        await client.publish("dummy-channel", "some random message to a channel")
        await client.publish("dummy-channel" , "some new message from publisher again!")

        await new Promise((resolve)=> setTimeout(resolve, 3000))
        await subscriber.unsubscribe("dummy-channel")
        await subscriber.quit()  // Will close the connection after 3 sec

        // Pipelinig & Transactions
        const multi = client.multi()
        multi.set("key-transaction 1" , "value 1")
        multi.set("key-transaction 2" , "value 2")
        multi.get("key-transaction 1")
        multi.get("key-transaction 2")

        const results = await multi.exec()
        // console.log(results)

        const multi2 = client.multi()
        multi.set("key-pipeline 1" , "value 1")
        multi.set("key-pipeline 2" , "value 2")
        multi.get("key-pipeline 1")
        multi.get("key-pipeline 2")

        const result = await multi.exec()
        // console.log(result)

        // for batch Processing
        const pipeline = client.multi()
        for(let i = 0; i<1000; i++){
            pipeline.set(`user:${i}:action`, `Action ${i}`)
        }
       const pipelineResult =  await pipeline.exec()
       console.log(pipelineResult)
    } catch (error) {
        console.log(error)
    } finally {
        await client.quit()
    }
}

testAdditionalFeatures()