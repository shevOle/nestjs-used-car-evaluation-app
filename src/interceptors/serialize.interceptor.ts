import { 
    NestInterceptor, 
    UseInterceptors,     
    ExecutionContext, 
    CallHandler,
 } from '@nestjs/common';
 import { Observable, map } from 'rxjs';
 import { plainToInstance } from 'class-transformer';

 export function Serialize(dto: any) {
    return UseInterceptors(new SerializieInterceptor(dto));
 }

 export class SerializieInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(_: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            })
        )
    }
 }