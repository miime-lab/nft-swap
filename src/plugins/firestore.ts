import firebase from './firebase'
class Firestore {
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

    async getOrderByMakerAddress(makerAddress: string, perPage: number, docSnapshot: any | undefined): Promise<any> {
        var query = this.db
            .collection("orders")
            .where("makerAddress", '==', makerAddress)
            .where("deleted", '==', false)
        return this.queryWithPagination(query, docSnapshot,perPage)
    }

    async getOrderByTakerAddress(takerAddress: string, perPage: number, docSnapshot: any | undefined): Promise<any> {
        var query = this.db
            .collection("orders")
            .where("takerAddress", '==', takerAddress)
            .where("deleted", '==', false)
        return this.queryWithPagination(query, docSnapshot,perPage)
    }

    async queryWithPagination(query:any, docSnapshot:any|undefined, perPage:number){
        interface output {
            docSnapshot: any,
            dataArray: object[]
        }
        var output: output
        output = { docSnapshot: {}, dataArray: [] }
        if (docSnapshot === undefined){
            await query.limit(perPage).get()
                .then((snapshot: any) => {
                    output.docSnapshot = snapshot
                    snapshot.forEach((doc: any) => {
                        let dic = doc.data()
                        dic.id = doc.id
                        output.dataArray.push(dic)
                    });
                })
        } else {
            await query.startAfter(docSnapshot.docs[docSnapshot.docs.length-1]).limit(perPage).get()
                .then((snapshot: any) => {
                    snapshot.forEach((doc: any) => {
                        output.dataArray.push(doc.data())
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

    async deleteOrder(docId: String) {
        await this.db
            .collection("orders")
            .doc(docId)
            .delete()
    }

    async logicalDeleteOrder(docId: String) {
        await this.db
            .collection("orders")
            .doc(docId)
            .update({ deleted: true })
    }
}

export default new Firestore()