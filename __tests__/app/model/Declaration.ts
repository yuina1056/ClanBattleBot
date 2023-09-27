
import { describe, expect, test } from "@jest/globals"
import dataSource from "../../../src/datasource"
import declaration from "../../../src/app/model/Declaration"
import Boss from "../../../src/entity/Boss"
import Declaration from "../../../src/entity/Declaration"
import { loadFixtures } from "../../loadfixtures"

// jest.useFakeTimers();

beforeEach( async () => {
    loadFixtures("../../../fixtures")
})

afterEach(async () => {
    await dataSource.destroy()
})

describe('クランバトル開催期間外', () => {
    // jest.setSystemTime(new Date('2023-09-01T12:00:00.000+09:00'))

    test('test', async () => {
        const boss = new Boss(
            1,
            1,
            "1"
        )
        expect(declaration.regist(boss, "1", 1)).toThrow("クランバトル開催情報が取得できませんでした");
    })
})

describe('無効ユーザ', () => {
    // jest.setSystemTime(new Date("2023-09-25T12:00:00.000+09:00"))

    const boss = new Boss(1, 1, "1")
    expect(() => declaration.regist(boss, "nopermissionuser", 1)).toThrow("ユーザー情報が取得できませんでした");
})

describe('重複凸宣言', () => {
    // jest.setSystemTime(new Date("2023-09-25T12:00:00.000+09:00"));

    const declarationRepository = dataSource.getRepository(Declaration)
    const pastDeclaration = new Declaration(
        1,
        1,
        1,
        1,
        0,
        1,
        1,
        true
    )
    declarationRepository.save(pastDeclaration)

    const boss = new Boss(1, 1, "1");
    expect(declaration.regist(boss, "1", 1)).toThrow("既に1ボスに凸宣言済みです");
})

describe("重複凸持ち越し含む", () => {
    // jest.setSystemTime(new Date("2023-09-25T12:00:00.000+09:00"));

    const declarationRepository = dataSource.getRepository(Declaration);
    const pastDeclaration1 = new Declaration(1, 1, 1, 1, 0, 1, 1, false);
    const pastDeclaration2 = new Declaration(1, 1, 1, 1, 0, 1, 1, true);
    declarationRepository.save(pastDeclaration1);
    declarationRepository.save(pastDeclaration2);

    const boss = new Boss(1, 1, "1");
    expect(declaration.regist(boss, "1", 1)).toThrow("既に1凸目は完了しています");
});

describe("重複凸持ち越しなし", () => {
    // jest.setSystemTime(new Date("2023-09-25T12:00:00.000+09:00"));

    const declarationRepository = dataSource.getRepository(Declaration);
    const pastDeclaration = new Declaration(1, 1, 1, 1, 0, 1, 1, true);
    declarationRepository.save(pastDeclaration);

    const boss = new Boss(1, 1, "1");
    expect(declaration.regist(boss, "1", 1)).toThrow("既に1凸目は完了しています");
});