interface MongoField {
    _id: string
    createdAt: Date
    updatedAt: Date
}

type TestModel = {
    user: string
    status: 'active' | 'failed'
} & MongoField
