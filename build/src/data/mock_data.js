"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAVORIET_DATA = exports.WINKELMAND_DATA = exports.USER_DATA = exports.KLEDING_DATA = void 0;
exports.KLEDING_DATA = [
    { id: 1, soort: 'trui', brand: 'Arte', size: 'XL' },
    { id: 2, soort: 'trui', brand: 'Nike', size: 'M' },
    { id: 3, soort: 'trui', brand: 'Adidas', size: 'L' },
    { id: 4, soort: 'trui', brand: 'Salomon', size: 'S' },
    { id: 5, soort: 'trui', brand: 'Polar', size: 'XXL' }
];
exports.USER_DATA = [
    { id: 1, voornaam: 'Lander', naam: 'Claes', email: 'lander.claes@student.hogent.be', wachtwoord: 'hallo123', winkelmand: 1, favoriet: 1 },
    { id: 2, voornaam: 'Lander', naam: 'Claes', email: 'lander.claes@student.hogent.be', wachtwoord: 'hallo123', winkelmand: 2, favoriet: 2 },
    { id: 3, voornaam: 'Lander', naam: 'Claes', email: 'lander.claes@student.hogent.be', wachtwoord: 'hallo123', winkelmand: 3, favoriet: 3 },
    { id: 4, voornaam: 'Lander', naam: 'Claes', email: 'lander.claes@student.hogent.be', wachtwoord: 'hallo123', winkelmand: 4, favoriet: 4 }
];
exports.WINKELMAND_DATA = [
    { id: 1, kledingIDS: [1, 2, 5] },
    { id: 2, kledingIDS: [1, 2, 5] },
    { id: 3, kledingIDS: [1, 2, 5] },
    { id: 4, kledingIDS: [4, 3, 5] }
];
exports.FAVORIET_DATA = [
    { id: 1, kledingIDS: [2, 3, 4] },
    { id: 2, kledingIDS: [2, 3, 4] },
    { id: 3, kledingIDS: [2, 3, 4] },
    { id: 4, kledingIDS: [2, 3, 4] }
];
