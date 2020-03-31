import Firestore from '../../../src/plugins/firestore';
const firestore = new Firestore()
interface testData {
    makerAddress: string
    status: string
}
describe('outer', ()=>{
    var orderId:string
    test('test1', async()=>{
        var data:testData
        data = {status:"created",makerAddress:"aaaa"}
        orderId = await firestore.addOrder(data)
    })
    test('getOrder', async()=>{
        const res = await firestore.getOrder(orderId)
        expect(res.status).toBe("created")
    })
    test("updateData", async()=>{
        var data:testData
        data={status:"updated",makerAddress:"bbbb"}
        await firestore.updateOrder(orderId, data)
        const res = await firestore.getOrder(orderId)
        expect(res.status).toBe("updated")   })
    test("deleteOrder",async()=>{
        await firestore.deleteOrder(orderId)
    })
    test("getOrderByMakerAddress", async()=>{
        var makerAddressList:String[] = ["aaaa", "bbbb", "cccc","aaaa","aaaa"]
        var objectIdList:String[] = []
        makerAddressList.map(async(address)=>{
            objectIdList.push(
            await firestore.addOrder({makerAddress:address}))
        })
        const first = await firestore.getOrderByMakerAddress("aaaa",2,undefined)
        console.log(first.docSnapshot)
        // pagination by snapshot still not work....
        // const second = await firestore.getOrderByMakerAddress("aaaa",2,first.docSnapshot)
    })
    })

