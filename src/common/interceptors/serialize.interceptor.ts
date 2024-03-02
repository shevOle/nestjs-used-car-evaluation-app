import { 
    NestInterceptor, 
    UseInterceptors,     
    ExecutionContext, 
    CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializieInterceptor(dto));
}

class SerializieInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) {}

    intercept(_: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: ClassConstructor) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            })
        )
    }
}