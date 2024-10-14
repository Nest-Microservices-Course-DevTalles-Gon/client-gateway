import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class OrdersStatusDto {

    @IsEnum(OrderStatusList, {
        message: `Possible status values are ${OrderStatusList}`
    })

    status: OrderStatus
}