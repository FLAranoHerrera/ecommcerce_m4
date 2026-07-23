import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthenticatedRequest } from '../../common/security/auth.guard';

describe('OrdersController identity', () => {
  const ordersService = {
    addOrder: jest.fn(),
    findAll: jest.fn(),
    getOrder: jest.fn(),
  };
  const controller = new OrdersController(
    ordersService as unknown as OrdersService,
  );
  const request = (sub: string, admin = false) =>
    ({ user: { sub, admin } }) as unknown as AuthenticatedRequest;

  beforeEach(() => jest.clearAllMocks());

  it('creates an order for the authenticated user', async () => {
    const dto = { products: [{ id: crypto.randomUUID(), quantity: 2 }] };
    await controller.create(dto, request('authenticated-user'));
    expect(ordersService.addOrder).toHaveBeenCalledWith(
      'authenticated-user',
      dto,
    );
  });

  it('passes ownership context when reading an order', async () => {
    const orderId = crypto.randomUUID();
    await controller.findOne(orderId, request('user-id', true));
    expect(ordersService.getOrder).toHaveBeenCalledWith(
      orderId,
      'user-id',
      true,
    );
  });

  it('lists only the authenticated user orders for a regular user', async () => {
    const query = { page: 1, limit: 10 };
    await controller.findAll(query, request('user-id'));
    expect(ordersService.findAll).toHaveBeenCalledWith('user-id', false, query);
  });

  it('passes admin context when listing every order', async () => {
    const query = { page: 2, limit: 5 };
    await controller.findAll(query, request('admin-id', true));
    expect(ordersService.findAll).toHaveBeenCalledWith('admin-id', true, query);
  });
});
