import { Injectable } from '@nestjs/common';
import { Comment } from 'src/feed/entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private readonly dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }
}
