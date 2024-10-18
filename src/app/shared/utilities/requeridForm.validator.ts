import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function requeridPassportDPiNit(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const dpiControl = group.get('dpi');
        const passportControl = group.get('passport');
        const nitControl = group.get('nit');

        const dpi = dpiControl ? dpiControl.value : null;
        const passport = passportControl ? passportControl.value : null;
        const nit = nitControl ? nitControl.value : null;
        if (dpi || passport || nit) {
            return null;
        }

        return { requeridPassportDPiNit: true };
    }
}