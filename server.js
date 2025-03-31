const redis = require('redis')

const client = redis.createClient({
    host : 'localhost',
    port : 6379
})

// Creating Event Listner
client.on("error" , (error)=>{
    console.log("Redis client connection",error)
})

async function testRedisConnection(){
    try {
        await client.connect()
        console.log("Redis connected !")

        await client.set("name" , "amish")  // In set we will pass key and value

        const extractValue = await client.get("name") // We are extracting value from key
        console.log(extractValue , "Line 21")

        const deletekey = await client.del("name")  // Will get 1 as 1 value is deleted
        console.log(deletekey , "Line "+ 24)

        const extractUpdatedValue = await client.get("name")  // Will give null as there is empty value
        console.log(extractUpdatedValue , "Line "+ 27)

        await client.set("count", 100)

        const incrementCount = await client.incr("count") // Will increase value by +1
        console.log(incrementCount, "Line "+31)

        await client.set("count" ,100)
        const decrementCount = await client.decr("count")  // Will decrease value by -1
        console.log(decrementCount ,"Line "+ 35)

        await client.decr("count")
        await client.decr("count")
        await client.decr("count")
        await client.decr("count")
        await client.decr("count")
        console.log(await client.get("count"),"Line "+ 42)
    } catch (error) {
        console.log(error)
    } finally {
        await client.quit()
    }
}

testRedisConnection()