import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/interfaces/categories/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}
  async create(payload: Category): Promise<Category> {
    try {
      const { category } = payload;

      const foundCategory = await this.categoryModel
        .findOne({
          category: category,
        })
        .exec();

      if (foundCategory) {
        throw new Error(`Category ${category} already exists.`);
      }

      const createdCategory = new this.categoryModel(payload);
      return await createdCategory.save();
    } catch (err) {
      throw new RpcException(err.message);
    }
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async findById(id: string): Promise<Category> {
    if (!id) {
      throw new Error('Invalid ID provided.');
    }

    const result = await this.categoryModel
      .findById({
        _id: id,
      })
      .exec();

    if (!result) {
      throw new Error(`Category with ID ${id} not found.`);
    }

    return result;
  }

  async update(body: Category, id: string): Promise<void> {
    if (!id) {
      throw new Error('Invalid ID provided.');
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            description: body.description,
            events: body.events,
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedCategory) {
      throw new Error(`Category with ID ${id} not found.`);
    }
  }
}
