import firebase from './firebase'
export default class Firestore {
    db: any;
    constructor() {
        this.db = firebase.firestore()
    }
    async getOrder(docId: string): Promise<any> {
        var orderData: object
        orderData = await this.db
            .collection("orders")
            .doc(docId)
            .get().then(function (doc: any) {
                return doc.data()
            })
        return orderData
    }

    async getOrderByMakerAddress(makerAddress: string, perPage: number, docSnapshot: object | undefined): Promise<any> {
        interface output {
            docSnapshot: any,
            dataArray: object[]
        }
        var output: output
        output = { docSnapshot: {}, dataArray: [] }
        var query = this.db
            .collection("orders")
            .where("makerAddress", '==', makerAddress)
            .limit(perPage)
        if (docSnapshot === undefined) {
            await query.get()
                .then((snapshot: any) => {
                    snapshot.forEach((doc: any) => {
                        output.docSnapshot = snapshot
                        output.dataArray.push(doc.data())
                    });
                })
            console.log(2222,output.docSnapshot)
        } else {
            return await query.startAfter(docSnapshot).get()
                .then((snapshot: any) => {
                    snapshot.forEach((doc: any) => {
                        console.log(doc.data())
                    });
                })
        }
        return output
    }

    async addOrder(dic: object): Promise<string> {
        const res = await this.db
            .collection("orders")
            .add(dic)
            .then((ref: { id: string; }) => { return ref.id })
        return res
    }

    async updateOrder(docId: string, dic: object) {
        await this.db
            .collection("orders")
            .doc(docId)
            .update(dic)
    }

    async deleteOrder(docId: string) {
        await this.db
            .collection("orders")
            .doc(docId)
            .delete()
    }

}