import * as Moongose from 'mongoose';

export const CategorySchema = new Moongose.Schema(
  {
    category: { type: String, unique: true },
    description: { type: String },
    events: [
      {
        name: { type: String },
        operation: { type: String },
        value: { type: Number },
      },
    ],
    players: [{ type: Moongose.Schema.Types.ObjectId, ref: 'Player' }],
  },
  { timestamps: true, collection: 'categories' },
);
