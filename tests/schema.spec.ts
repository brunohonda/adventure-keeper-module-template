import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import Ajv from "ajv";

describe("Adventure Keeper Starter Module Suite", () => {
  const rootDir = resolve(__dirname, "..");
  const manifest = JSON.parse(
    readFileSync(resolve(rootDir, "module.json"), "utf-8"),
  );
  const characterSchema = JSON.parse(
    readFileSync(resolve(rootDir, "schemas/character-extension.json"), "utf-8"),
  );
  const campaignSchema = JSON.parse(
    readFileSync(resolve(rootDir, "schemas/campaign-extension.json"), "utf-8"),
  );
  const ptBR = JSON.parse(
    readFileSync(resolve(rootDir, "locales/pt-BR.json"), "utf-8"),
  );
  const en = JSON.parse(
    readFileSync(resolve(rootDir, "locales/en.json"), "utf-8"),
  );

  describe("Manifest Validation (module.json)", () => {
    it("should contain all required fields with correct types", () => {
      expect(manifest.id).toBeDefined();
      expect(typeof manifest.id).toBe("string");
      expect(manifest.name).toBeDefined();
      expect(manifest.version).toBeDefined();
      expect(manifest.description).toBeDefined();
      expect(manifest.author).toBeDefined();
      expect(manifest.license).toBe("MIT");
      expect(manifest.defaultLocale).toBe("pt-BR");
    });

    it("should follow canonical namespace convention (namespace.module-name)", () => {
      const idPattern = /^[a-z0-9_-]+\.[a-z0-9_-]+(\.[a-z0-9_-]+)*$/;
      expect(idPattern.test(manifest.id)).toBe(true);
    });

    it("should use valid SemVer format", () => {
      const semverPattern = /^\d+\.\d+\.\d+/;
      expect(semverPattern.test(manifest.version)).toBe(true);
    });
  });

  describe("Character Extension Schema", () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(characterSchema);

    it("should validate a correct character payload", () => {
      const validData = {
        heroPoints: 2,
        reputation: 15,
        alignment: "chaotic_good",
        customAttributes: {
          strength: 14,
          dexterity: 16,
          constitution: 12,
          intelligence: 10,
          wisdom: 13,
          charisma: 8,
        },
      };

      const isValid = validate(validData);
      expect(isValid).toBe(true);
      expect(validate.errors).toBeNull();
    });

    it("should reject payload with unknown extra properties (additionalProperties: false)", () => {
      const invalidData = {
        heroPoints: 1,
        reputation: 0,
        alignment: "neutral_good",
        arbitraryField: "attack-vector",
      };

      const isValid = validate(invalidData);
      expect(isValid).toBe(false);
      expect(validate.errors?.[0]?.keyword).toBe("additionalProperties");
    });

    it("should reject invalid alignment enum value", () => {
      const invalidData = {
        heroPoints: 1,
        reputation: 0,
        alignment: "super_evil",
      };

      const isValid = validate(invalidData);
      expect(isValid).toBe(false);
    });
  });

  describe("Campaign Extension Schema", () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(campaignSchema);

    it("should validate a correct campaign settings payload", () => {
      const validData = {
        dangerLevel: "deadly",
        customCalendar: "Forgotten Realms Calendar",
        allowGritRest: true,
      };

      const isValid = validate(validData);
      expect(isValid).toBe(true);
    });

    it("should reject payload with invalid danger level enum", () => {
      const invalidData = {
        dangerLevel: "apocalyptic",
      };

      const isValid = validate(invalidData);
      expect(isValid).toBe(false);
    });
  });

  describe("Internationalization (i18n)", () => {
    it("should have all keys present in both pt-BR and en", () => {
      expect(ptBR.starter.tabs.stats).toBeDefined();
      expect(en.starter.tabs.stats).toBeDefined();

      expect(ptBR.starter.fields.heroPoints).toBeDefined();
      expect(en.starter.fields.heroPoints).toBeDefined();

      expect(ptBR.starter.fields.dangerLevel).toBeDefined();
      expect(en.starter.fields.dangerLevel).toBeDefined();
    });
  });
});
