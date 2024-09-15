import * as Moongoose from 'mongoose';

export const PlayerSchema = new Moongoose.Schema(
  {
    phone: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    name: String,
    ranking: String,
    rankingPosition: Number,
    avatar: String,
  },
  { timestamps: true, collection: 'players' },
);
