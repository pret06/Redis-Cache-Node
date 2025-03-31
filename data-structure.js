const redis = require('redis')

const client = redis.createClient({
    host : 'localhost',
    port : 6379
})

// Event listener
client.on("error" , (error)=>{
    console.log("Redis Unable to connect" , error)
})

async function redisDataStructure() {
    try {
        await client.connect()
        console.log("Redis Connected!")

        // STRINGS ---> SET , GET , MSET , MGET  [MSET and MGET are used to set and get multiple key and value]
        await client.set("user : email" , "amishdeveloper006@gmail.com")
        const name = await client.get("user : email")
        // console.log(name , " : Line " + 21)

        await client.mSet([
            "user : email",
            "amishdeveloper006@gmail.com",
            "user : age",
            "24",
            "user : country",
            "india"
        ])

        const [email, age , country] = await client.mGet([
           "user : email",
           "user : age",
           "user : country"
        ])
        // console.log(email , age , country , " : Line " + 35)

        // LIST --> LPUSH , RPUSH , LRANGE , LPOP , RPOP [SO these Will return the first and last elemet in the list and remove first & last elememt in the list]
        // * LPUSH inserts elements in reverse order (from right to left)

        await client.lPush("notes", ["note 1", "note 2" , "note 3"])
        const extractList = await client.lRange("notes" ,0 , -1)
        // console.log(extractList , " : Line " , 44)

        const firstNote = await client.lPop("notes")
        // console.log(firstNote , " : Line ", 47)

        const remainigvalue = await client.lRange("notes" , 0 ,-1)
        // console.log(remainigvalue , " : Line " , 50)

         // sets -> SADD, SMEMBERS, SISMEMBER, SREM
        await client.sAdd("user : nickname", ["amish", "pret", "monu"])
        const extractedvalues = await client.sMembers("user : nickname")
        // console.log(extractedvalues , "Line 55")

        const isAmishIsMemberOfThisArray = await client.sIsMember("user : nickname" , "amish")  // Will return answer in true or false
        // console.log(isAmishIsMemberOfThisArray , "Line 59")

        const updatedValue = await client.sRem("user : nickname", "monu")
        // console.log(updatedValue , "Line 62")

        const getValueOfLatestArray = await client.sMembers("user : nickname") // To get all remaining values after removing one
        // console.log(getValueOfLatestArray , 64)

        //sorted sets -->  ZADD, ZRANGE, ZRANK, ZREM
        
        await client.zAdd("cart", [
            {
                score : 100,                // Score basically helps us to sort the indexing on array based on score
                value : "cart 1"
            },
            {
                score : 250,
                value : "cart 2"
            },
            {
                score : 200,
                value : "cart 3"
            },

        ])
        const extractedValues = await client.zRange("cart", 0 ,-1)
        // console.log(extractedValues , "Line 84")

        const extractAllCartItemsWithScore = await client.zRange("cart" , 0 ,-1 )
        // console.log(extractAllCartItemsWithScore , "Line 87")

        const cartItemwithRank2 = await client.zRank("cart" ,"cart 2")
        // console.log(cartItemwithRank2 , "Line 90")

        //hashes -> HSET, HGET, HGETALL, HDEL
        await client.hSet("product 1" ,{
            name : "bike",
            description : "speed",
            validity : 2030
        })
        const extractedValue = await client.hGet("product 1" , "name")
        // console.log(extractedValue , "Line 99")

        const getAllProductInfo = await client.hGetAll("product 1")
        // console.log(getAllProductInfo , "Line 102")

        const deleteOneFeildInProduct = await client.hDel("product 1" , "validity")
        // console.log(deleteOneFeildInProduct)

        const RemainingFeildCheck = await client.hGetAll("product 1")
        console.log(RemainingFeildCheck , "Line 108")

    } catch (error) {
        console.log(error)
    } finally {
        await client.quit()
    }
}

redisDataStructure()