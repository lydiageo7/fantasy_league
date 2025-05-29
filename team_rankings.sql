
CREATE VIEW team_rankings AS
SELECT
    t.team_id,
    t.team_name,
    COUNT(pm.playing_match_id) AS P,
    SUM(CASE
        WHEN (pm.home_team_id = t.team_id AND pm.score_home_team > pm.score_guest_team)
          OR (pm.guest_team_id = t.team_id AND pm.score_guest_team > pm.score_home_team)
        THEN 1 ELSE 0 END) AS W,
    SUM(CASE
        WHEN pm.score_home_team = pm.score_guest_team
        THEN 1 ELSE 0 END) AS D,
    SUM(CASE
        WHEN (pm.home_team_id = t.team_id AND pm.score_home_team < pm.score_guest_team)
          OR (pm.guest_team_id = t.team_id AND pm.score_guest_team < pm.score_home_team)
        THEN 1 ELSE 0 END) AS L,
    SUM(CASE
        WHEN pm.home_team_id = t.team_id THEN pm.score_home_team
        ELSE pm.score_guest_team END) AS F,
    SUM(CASE
        WHEN pm.home_team_id = t.team_id THEN pm.score_guest_team
        ELSE pm.score_home_team END) AS A,
    SUM(CASE
        WHEN pm.home_team_id = t.team_id THEN pm.score_home_team - pm.score_guest_team
        ELSE pm.score_guest_team - pm.score_home_team END) AS GD,
    SUM(CASE
        WHEN (pm.home_team_id = t.team_id AND pm.score_home_team > pm.score_guest_team)
          OR (pm.guest_team_id = t.team_id AND pm.score_guest_team > pm.score_home_team)
        THEN 3
        WHEN pm.score_home_team = pm.score_guest_team THEN 1
        ELSE 0 END) AS Pts
FROM
    Team t
LEFT JOIN
    Playing_Match pm
    ON t.team_id = pm.home_team_id OR t.team_id = pm.guest_team_id
GROUP BY
    t.team_id
ORDER BY
    Pts DESC, GD DESC, F DESC;
