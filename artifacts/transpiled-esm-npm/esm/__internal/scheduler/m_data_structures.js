/* eslint-disable @typescript-eslint/no-extraneous-class */
export class AppointmentTooltipInfo {
  constructor(appointment) {
    var targetedAppointment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    this.appointment = appointment;
    this.targetedAppointment = targetedAppointment;
    this.color = color;
    this.settings = settings;
  }
}