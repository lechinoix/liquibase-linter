import { lint } from "./linter";

const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
  return undefined as never;
});

describe("linter.ts", () => {
  describe("with yaml files", () => {
    beforeEach(() => {
      mockExit.mockClear();
    });

    it("should fail on changelog with breaking changes", () => {
      const violations = lint("src/fixtures/20210609163846-drop-column.yaml", {
        failOnErrors: false,
      });

      expect(violations).toStrictEqual([
        {
          level: "ERROR",
          message: "The changeset contains the following breaking changes dropColumn!",
          changeSetId: "1623249542074-23",
          fileName: "src/fixtures/20210609163846-drop-column.yaml",
        },
        {
          level: "ERROR",
          message: "The changeset contains the following breaking changes dropTable!",
          changeSetId: "1623249542074-23",
          fileName: "src/fixtures/20210609163846-drop-column.yaml",
        },
      ]);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it("should fail on changelog with breaking changes", () => {
      const violations = lint("src/fixtures/20210609163846-drop-column.yaml", {
        failOnErrors: true,
      });

      expect(violations).toStrictEqual([
        {
          level: "ERROR",
          message: "The changeset contains the following breaking changes dropColumn!",
          changeSetId: "1623249542074-23",
          fileName: "src/fixtures/20210609163846-drop-column.yaml",
        },
        {
          level: "ERROR",
          message: "The changeset contains the following breaking changes dropTable!",
          changeSetId: "1623249542074-23",
          fileName: "src/fixtures/20210609163846-drop-column.yaml",
        },
      ]);
      expect(mockExit).toHaveBeenCalledTimes(1);
    });

    it("should pass on changelog without breaking changes", () => {
      const violations = lint("src/fixtures/20200115-ff4j.yml", {
        failOnErrors: false,
      });

      expect(violations).toStrictEqual([]);
    });
  });

  describe("with json files", () => {
    beforeEach(() => {
      mockExit.mockClear();
    });

    it("should pass on changelog without breaking changes", () => {
      const violations = lint("src/fixtures/20200115-ff4j.json", {
        failOnErrors: false,
      });

      expect(violations).toStrictEqual([]);
    });

    it("should fail on changelog with breaking changes", () => {
      mockExit.mockClear();

      const violations = lint("src/fixtures/20210609163846-several-failing-changeset.json", {
        failOnErrors: false,
      });

      expect(violations).toStrictEqual([
        {
          level: "ERROR",
          message: "The changeset contains the following breaking changes dropColumn!",
          changeSetId: "1623249542074-23",
          fileName: "src/fixtures/20210609163846-several-failing-changeset.json",
        },
        {
          level: "ERROR",
          message: "The changeset contains the following breaking changes dropTable!",
          changeSetId: "1623249542074-24",
          fileName: "src/fixtures/20210609163846-several-failing-changeset.json",
        },
      ]);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it("should fail on changelog with breaking changes", () => {
      const violations = lint("src/fixtures/20210609163846-several-failing-changeset.json", {
        failOnErrors: true,
      });

      expect(violations).toStrictEqual([
        {
          level: "ERROR",
          message: "The changeset contains the following breaking changes dropColumn!",
          changeSetId: "1623249542074-23",
          fileName: "src/fixtures/20210609163846-several-failing-changeset.json",
        },
        {
          level: "ERROR",
          message: "The changeset contains the following breaking changes dropTable!",
          changeSetId: "1623249542074-24",
          fileName: "src/fixtures/20210609163846-several-failing-changeset.json",
        },
      ]);
      expect(mockExit).toHaveBeenCalledTimes(1);
    });
  });
});
