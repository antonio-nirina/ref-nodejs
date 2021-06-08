import { Collection, Db, MongoClient, ObjectID } from "mongodb"

class MongoDbProvider {
	private database?: Db
	private mongoClient: MongoClient

    constructor(url: string) {
		this.mongoClient = new MongoClient(url, { useUnifiedTopology: true })
	}

	get todoCollection(): Collection {
		const todoCollection = this.getCollection("todo")

		if (!todoCollection) {
			throw new Error("todo collection is undefined")
		}

		return todoCollection
	}

	async connectAsync(databaseName: string): Promise<void> {
		await this.mongoClient.connect()
		this.database = this.mongoClient.db(databaseName)
	}

	private getCollection(collectionName: string): Collection {
		if (!this.database) {
			throw new Error("Database is undefined.")
		}

		return this.database.collection(collectionName)
	}
}

const DATABASE_URI:string = process.env.DATABASE_URI ?? ""
export const mongoDbProvider = new MongoDbProvider(DATABASE_URI)