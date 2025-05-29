import { JwtService } from '@nestjs/jwt'
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets'

@WebSocketGateway()
export class AuthGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}

  // eslint-disable-next-line
  async handleConnection(client: any, ..._args: any[]) {
    const token = client.handshake.query?.token

    if (!token) {
      console.log('Token not provided')
      client.disconnect()
      return
    }

    try {
      const payload: { sub: string } = await this.jwtService.verifyAsync(
        token as string,
      )
      client.user = payload.sub // Associa o usuário ao cliente
      console.log(`Client connected: ${client.id}, User: ${payload.sub}`)
    } catch (error) {
      console.log('Invalid token:', (error as Error).message)
      client.disconnect()
    }
  }
}
