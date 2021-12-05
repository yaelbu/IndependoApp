export const snapshotToArray2= snapshot=>{
    let returnArr=[]

    snapshot.forEach(childSnapshot => {
        childSnapshot.forEach(grandchildSnapshot => {
            let item=grandchildSnapshot.val()
            item.key=grandchildSnapshot.key

            returnArr.push(item)
        })
    });

    return returnArr;
}