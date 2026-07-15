import { Module } from '@nestjs/common';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial])],
  controllers: [TestimonialsController],
  providers: [TestimonialsService]
})
export class TestimonialsModule {}
