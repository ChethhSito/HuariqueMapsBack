import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Suggestion } from './schemas/suggestion.schema';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectModel(Suggestion.name) private readonly suggestionModel: Model<Suggestion>,
  ) {}

  async create(name: string, email: string, message: string): Promise<Suggestion> {
    return this.suggestionModel.create({ name, email, message });
  }

  async findAll(): Promise<Suggestion[]> {
    return this.suggestionModel.find().sort({ createdAt: -1 }).exec();
  }
}
