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
        for (const address of makerAddressList){
            const objId = await firestore.addOrder({updatedAt:new Date().getTime(), makerAddress:address})
            console.log(objId)
            objectIdList.push(objId)}
        console.log(1111,objectIdList)
        //getFirstPage
        const firstPage = await firestore.getOrderByMakerAddress("aaaa",2,undefined)
        expect(firstPage.dataArray.length).toBe(2)
        //getSecondPage, pass docSnapshot of first page
        const secondPage = await firestore.getOrderByMakerAddress("aaaa",2,firstPage.docSnapshot)
        expect(secondPage.dataArray.length).toBe(1)
        objectIdList.map(async(val)=>await firestore.deleteOrder(val))
    })
    })

