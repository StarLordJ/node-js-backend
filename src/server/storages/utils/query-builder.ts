import { ItemTypes } from './items.enum';

export class QueryBuilder<T extends any> {
  private static tableMapper: Record<ItemTypes, string> = {
    capsule: '"public"."Capsules"',
    faq: '"public"."Faqs"',
    review: '"public"."Reviews"',
    crmUser: '"public"."CRM_Users"',
    order: '"public"."Orders"',
    payment: '"public"."Payments"',
    stylist: '"public"."Stylists"',
    client: '"public"."Clients"'
  };

  public constructor(private itemType: ItemTypes) {}

  public buildGetItemByIdQuery(id: number): string {
    return `SELECT * FROM ${
      QueryBuilder.tableMapper[this.itemType]
    } WHERE id='${id}'`;
  }

  public buildGetPublicItemsQuery(): string {
    return `SELECT * FROM ${
      QueryBuilder.tableMapper[this.itemType]
    } WHERE is_displaying=TRUE ORDER BY view_order`;
  }

  public buildGetItemsQuery(): string {
    return `SELECT * FROM ${QueryBuilder.tableMapper[this.itemType]} ${
      [ItemTypes.CAPSULE, ItemTypes.FAQ, ItemTypes.REVIEW].includes(this.itemType) ? 'ORDER BY view_order' : ''
    }`;
  }

  public buildSetNewItemQuery(item: Omit<T, 'id'>): string {
    const keys = Object.keys(item);
    const values = keys.map(key => item[key]);
    return `INSERT INTO ${QueryBuilder.tableMapper[this.itemType]} (${keys.join(
      ', '
    )}) VALUES (${values
      .map(QueryBuilder.valueToString)
      .join(',')}) RETURNING id`;
  }

  public buildUpdateItemQuery(payload: Pick<T, 'id'> & Partial<T>): string {
    const keys = Object.keys(payload).filter(key => key !== 'id').filter(Boolean);
    const values = keys.map(key => payload[key]);

    return `UPDATE ${QueryBuilder.tableMapper[this.itemType]} SET (${keys.join(
      ', '
    )}) = (${values.map(QueryBuilder.valueToString).join(', ')}) WHERE id='${
      payload['id']
    }'`;
  }

  public buildDeleteItemQuery(payload: Pick<T, 'id'>): string {
    return `DELETE FROM ${QueryBuilder.tableMapper[this.itemType]} WHERE id='${
      payload['id']
    }'`;
  }

  public buildQueryGetLastId(): string {
    return `SELECT MAX(id) FROM ${QueryBuilder.tableMapper[this.itemType]}`;
  }

  public buildChangeRowsOrderQuery(
    payload: Array<Pick<T, 'id' | 'view_order'>>
  ): string {
    return `UPDATE ${
      QueryBuilder.tableMapper[this.itemType]
    } SET view_order=CASE ${payload
      .map(({ id, view_order }) => `WHEN id=${id} THEN ${view_order}`)
      .join(' ')} END WHERE id IN(${payload.map(({ id }) =>
      QueryBuilder.valueToString(id)
    )})`;
  }

  private static valueToString(value: any): string {
    return Array.isArray(value)
      ? `'{${value.map(val => `"${val}"`).join(',')}}'`
      : `'${value}'`;
  }
}
