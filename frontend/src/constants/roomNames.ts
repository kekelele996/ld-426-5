import { RoomType } from '../types';

export const ROOM_NAMES: Record<RoomType, string> = {
  [RoomType.LivingRoom]: '客厅',
  [RoomType.Bedroom]: '卧室',
  [RoomType.Kitchen]: '厨房',
  [RoomType.Bathroom]: '卫浴',
  [RoomType.Balcony]: '阳台',
  [RoomType.Study]: '书房',
  [RoomType.Entrance]: '玄关'
};

export const ROOM_ORDER: RoomType[] = [
  RoomType.LivingRoom,
  RoomType.Bedroom,
  RoomType.Kitchen,
  RoomType.Bathroom,
  RoomType.Study,
  RoomType.Balcony,
  RoomType.Entrance
];
