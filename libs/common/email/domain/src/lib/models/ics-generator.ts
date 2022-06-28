import { ICalAlarmType, ICalCalendar, ICalCalendarMethod, ICalEventStatus } from 'ical-generator';

export interface ICSGeneratorConfig {
  id: string;
  eventName: string;
  organizer: string;
  start: Date | string;
  end: Date | string;
  timezone: string;
  location?: string;
  description?: string;
  alarm?: boolean;
  alarmTime?: number;
  update?: boolean;
  cancelled?: boolean;
  rsvp?: boolean;
}

export class ICSGenerator {
  generateIcsString(config: ICSGeneratorConfig) {
    const cal = new ICalCalendar();
    const calEvent = cal.createEvent({
      summary: config.eventName,
      organizer: config.organizer,
      start: config.start,
      end: config.end,
      timezone: config.timezone,
      location: config.location,
      description: config.description,
    });
    calEvent.uid(config.id);
    if (config.rsvp) cal.method(ICalCalendarMethod.REQUEST);
    if (config.alarm || config.alarmTime)
      calEvent.createAlarm({ type: ICalAlarmType.display, trigger: config.alarmTime ? config.alarmTime : 900 });
    if (config.update) calEvent.sequence(1);
    if (config.cancelled) {
      cal.method(ICalCalendarMethod.CANCEL);
      calEvent.status(ICalEventStatus.CANCELLED);
      calEvent.sequence(2);
    }
    return cal.toString();
  }
}
