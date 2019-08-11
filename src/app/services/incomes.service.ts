import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface IMarketInterface {
    id?: string;
    name: string;
    sum: number;
}

@Injectable({
    providedIn: 'root'
})
export class IncomesService {
    private ideas: Observable<IMarketInterface[]>;
    private ideaCollection: AngularFirestoreCollection<IMarketInterface>;

    constructor(private afs: AngularFirestore) {
        this.ideaCollection = this.afs.collection<IMarketInterface>('incomes');
        this.ideas = this.ideaCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );
    }

    public getIncomes(): Observable<IMarketInterface[]> {
        return this.ideas;
    }

    public getMarketIncomes(id: string): Observable<IMarketInterface> {
        return this.ideaCollection.doc<IMarketInterface>(id).valueChanges().pipe(
            take(1),
            map(idea => {
                idea.id = id;
                return idea;
            })
        );
    }

    public addMarketIncomes(data: IMarketInterface): Promise<DocumentReference> {
        return this.ideaCollection.add(data);
    }

    public updateMarketIncomes(data: IMarketInterface): Promise<void> {
        return this.ideaCollection.doc(data.id).update({ name: data.name, sum: data.sum });
    }

    public deleteMarketIncomes(id: string): Promise<void> {
        return this.ideaCollection.doc(id).delete();
    }
}
