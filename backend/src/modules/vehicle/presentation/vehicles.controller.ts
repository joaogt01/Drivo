import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { CreateVehicleUseCase } from '../application/create-vehicle.use-case';
import { DeleteVehicleUseCase } from '../application/delete-vehicle.use-case';
import { GetVehicleUseCase } from '../application/get-vehicle.use-case';
import { ListVehiclesUseCase } from '../application/list-vehicles.use-case';
import { UpdateVehicleUseCase } from '../application/update-vehicle.use-case';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string };
}

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(
    private readonly createVehicle: CreateVehicleUseCase,
    private readonly listVehicles: ListVehiclesUseCase,
    private readonly getVehicle: GetVehicleUseCase,
    private readonly updateVehicle: UpdateVehicleUseCase,
    private readonly deleteVehicle: DeleteVehicleUseCase,
  ) {}

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateVehicleDto) {
    return this.createVehicle.execute(request.user.id, dto);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.listVehicles.execute(request.user.id);
  }

  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.getVehicle.execute(request.user.id, id);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.updateVehicle.execute(request.user.id, id, dto);
  }

  @Delete(':id')
  async remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.deleteVehicle.execute(request.user.id, id);

    // mantém o contrato atual da API
    return { message: 'Veículo excluído com sucesso.' };
  }
}