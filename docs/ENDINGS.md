# ENDINGS

判定は上から順に最初に一致したもの（`src/data/misc.ts`）。死亡時は「死因と経緯」→「その後（残した伝言・写真・助けた人）」→エンディング。

| ID | 種別 | タイトル | 条件 |
|---|---|---|---|
| e_death_msg | death | 声は、届いた | `{"dead":true,"flag":"msg_fam1"}` |
| e_death_unsent | death | 未送信のメッセージ | `{"dead":true,"flag":"msgfail_fam1","notFlag":"msg_fam1"}` |
| e_death_helper | death | あの日の人 | `{"dead":true,"anyFlag":["helped_hiroto","helped_saeki","helped_haruno","helped_morimoto"],"notFlag":"msg_fam1"}` |
| e_death | death | 帰れなかった日 | `{"dead":true}` |
| e_volunteer | rebuild | あの日から始まった仕事 | `{"flag":"volunteer","npcAlive":"friend"}` |
| e_lost_friend | loss | 隣にいない季節 | `{"npcDead":"friend"}` |
| e_lost_grandma | loss | 羊羹の約束 | `{"npcDead":"fam2"}` |
| e_meet | survive | 決めておいた場所 | `{"flag":["meetpoint","reunited_family"]}` |
| e_partner | survive | 港南口で | `{"flag":"reunited_partner"}` |
| e_home | rebuild | ただいま | `{}` |

## その後（after pieces）

| ID | 語り手 | 条件 |
|---|---|---|
| a_171 | {fam1} | `{"flag":"msg_fam1"}` |
| a_unsent | {fam1} | `{"flag":"msgfail_fam1"}` |
| a_photo_friend | 拓海 | `{"flag":"photo_promenade_two","npcAlive":"friend"}` |
| a_photo_family | {fam2} | `{"flag":"photo_family_call"}` |
| a_hiroto | 大翔 | `{"flag":"helped_hiroto"}` |
| a_saeki | 佐伯 | `{"flag":"helped_saeki","npcAlive":"saeki"}` |
| a_haruno | 春野 | `{"flag":"helped_haruno"}` |
| a_morimoto | 森本 | `{"flag":"helped_morimoto"}` |
| a_promise | {fam1} | `{"flag":"promise"}` |
| a_meet | {fam1} | `{"flag":"meetpoint"}` |
| a_nomeet | {fam1} | `{"notFlag":"meetpoint"}` |
| a_wk_card | {fam2} | `{"flag":"hina_card"}` |
| a_bando | 坂東 | `{"flag":"bando_car_left"}` |
| a_st_gma_hand | {fam1} | `{"flag":"gma_with_me"}` |
| a_pa_letter | {fam1} | `{"flag":"misaki_has_letter"}` |
| a_miyauchi | 宮内 | `{"flag":"helped_miyauchi"}` |
| a_report | — | `{}` |
